// 統計的判定システム - 2項分布による科学的分析
import { 
  StatisticalAnalysis 
} from '../types';

export class BinomialDistributionAnalyzer {
  // 2項分布の確率密度関数
  binomialPDF(k: number, n: number, p: number): number {
    if (k > n || k < 0 || n < 0 || p < 0 || p > 1) return 0;
    const binomCoeff = this.combination(n, k);
    return binomCoeff * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }
  
  // 組み合わせ計算（nCk）
  combination(n: number, k: number): number {
    if (k > n || k < 0) return 0;
    if (k === 0 || k === n) return 1;
    
    // より効率的な計算
    k = Math.min(k, n - k);
    let result = 1;
    for (let i = 0; i < k; i++) {
      result = result * (n - i) / (i + 1);
    }
    return result;
  }
  
  // 各設定での出現確率を計算
  calculateLikelihood(observed: number, total: number, expectedRate: number): number {
    if (total === 0) return 0;
    return this.binomialPDF(observed, total, expectedRate);
  }
  
  // 累積分布関数（上側）- 上振れ確率計算用
  calculateUpperTailProbability(observed: number, total: number, expectedRate: number): number {
    if (total === 0) return 0;
    let upperTailProb = 0;
    for (let k = observed; k <= total; k++) {
      upperTailProb += this.binomialPDF(k, total, expectedRate);
    }
    return upperTailProb;
  }
  
  // ベイズ推定による設定確率計算
  calculateSettingProbabilities(evidenceData: any): Record<number, number> {
    const priorProbability = 1/5; // 事前確率（各設定等確率と仮定）
    const settings = [1, 2, 4, 5, 6];
    const likelihoods: Record<number, number> = {};
    
    // 各設定での尤度計算
    settings.forEach(setting => {
      let totalLogLikelihood = 0; // 対数尤度で計算（数値安定性のため）
      
      // 各要素の尤度を掛け合わせ（対数空間で加算）
      Object.entries(evidenceData).forEach(([element, data]) => {
        const likelihood = this.calculateElementLikelihood(element, data as any, setting);
        if (likelihood > 0) {
          totalLogLikelihood += Math.log(likelihood);
        } else {
          totalLogLikelihood += -50; // 非常に小さい値
        }
      });
      
      likelihoods[setting] = Math.exp(totalLogLikelihood) * priorProbability;
    });
    
    // 正規化して確率に変換
    const totalEvidence = Object.values(likelihoods).reduce((sum, val) => sum + val, 0);
    const probabilities: Record<number, number> = {};
    
    if (totalEvidence > 0) {
      settings.forEach(setting => {
        probabilities[setting] = (likelihoods[setting] / totalEvidence) * 100;
      });
    } else {
      // 全ての尤度が0の場合は等確率
      settings.forEach(setting => {
        probabilities[setting] = 20;
      });
    }
    
    return probabilities;
  }
  
  // 要素別尤度計算
  calculateElementLikelihood(element: string, data: any, setting: number): number {
    const expectedRates = this.getExpectedRates(element, setting);
    if (!expectedRates) return 1;
    
    if (element === 'voice') {
      if (data.total === 0) return 1;
      return this.calculateLikelihood(data.jaggyAmiba, data.total, expectedRates.jaggyAmibaRate);
    } else if (element === 'bell') {
      if (data.total === 0) return 1;
      // ベル比率の尤度計算（正規分布近似）
      const expectedRatio = expectedRates.ratio;
      const actualRatio = data.middle / data.diagonal;
      const variance = 1.0; // 分散（調整可能）
      
      if (!isFinite(actualRatio)) return 0.1; // 無限大の場合は小さい値
      return Math.exp(-Math.pow(actualRatio - expectedRatio, 2) / (2 * variance));
    } else if (element === 'watermelon') {
      if (data.normal.total === 0) return 1;
      return this.calculateLikelihood(data.normal.hit, data.normal.total, expectedRates.weakWatermelonRate);
    } else if (element === 'initialHit') {
      if (data.nonCherryHits === 0) return 1;
      const actualRate = 1 / (data.totalGames / data.nonCherryHits);
      const expectedRate = expectedRates.initialHitRate;
      const variance = 0.0001; // より狭い分散
      
      return Math.exp(-Math.pow(actualRate - expectedRate, 2) / (2 * variance));
    } else if (element === 'modeTransition') {
      if (data.totalATEnds === 0) return 1;
      return this.calculateLikelihood(data.heavenStarts, data.totalATEnds, expectedRates.heavenTransitionRate);
    }
    
    return 1;
  }
  
  // 期待値データベース（金くまナレッジ準拠）
  getExpectedRates(element: string, setting: number): any {
    const rateDatabase: Record<string, Record<number, any>> = {
      voice: {
        1: { jaggyAmibaRate: 0.153 },
        2: { jaggyAmibaRate: 0.168 },
        4: { jaggyAmibaRate: 0.250 },
        5: { jaggyAmibaRate: 0.268 },
        6: { jaggyAmibaRate: 0.287 }
      },
      bell: {
        1: { ratio: 11.0 },
        2: { ratio: 10.0 },
        4: { ratio: 8.5 },
        5: { ratio: 7.5 },
        6: { ratio: 6.5 }
      },
      watermelon: {
        1: { weakWatermelonRate: 0.14 },
        2: { weakWatermelonRate: 0.15 },
        4: { weakWatermelonRate: 0.17 },
        5: { weakWatermelonRate: 0.18 },
        6: { weakWatermelonRate: 0.1916 }
      },
      initialHit: {
        1: { initialHitRate: 1/600 },
        2: { initialHitRate: 1/580 },
        4: { initialHitRate: 1/520 },
        5: { initialHitRate: 1/500 },
        6: { initialHitRate: 1/480 }
      },
      modeTransition: {
        1: { heavenTransitionRate: 0.176 },
        2: { heavenTransitionRate: 0.183 },
        4: { heavenTransitionRate: 0.235 },
        5: { heavenTransitionRate: 0.261 },
        6: { heavenTransitionRate: 0.279 }
      }
    };
    
    return rateDatabase[element] ? rateDatabase[element][setting] : null;
  }
  
  // 設定間の確率比較
  calculateProbabilityRatios(probabilities: Record<number, number>): Record<string, number> {
    const ratios: Record<string, number> = {};
    const setting6Prob = probabilities[6];
    const setting5Prob = probabilities[5];
    
    [1, 2, 4, 5].forEach(setting => {
      if (probabilities[setting] > 0) {
        ratios[`6vs${setting}`] = setting6Prob / probabilities[setting];
      } else {
        ratios[`6vs${setting}`] = Infinity;
      }
    });
    
    // 高設定(5-6)vs低設定(1-2)の比較
    const highSettingProb = setting5Prob + setting6Prob;
    const lowSettingProb = probabilities[1] + probabilities[2];
    
    if (lowSettingProb > 0) {
      ratios['highVsLow'] = highSettingProb / lowSettingProb;
    } else {
      ratios['highVsLow'] = Infinity;
    }
    
    return ratios;
  }
}

// 上振れ vs 実力判定クラス
export class VarianceAnalyzer {
  private binomAnalyzer: BinomialDistributionAnalyzer;

  constructor() {
    this.binomAnalyzer = new BinomialDistributionAnalyzer();
  }
  
  // 設定1でこの結果が出る確率（上振れ確率）
  calculateUpperVarianceProbability(observedData: any, element: string = 'voice'): number {
    const setting1Rates = this.binomAnalyzer.getExpectedRates(element, 1);
    if (!setting1Rates || observedData.total === 0) return 50;
    
    if (element === 'voice') {
      const { jaggyAmiba, total } = observedData;
      return this.binomAnalyzer.calculateUpperTailProbability(jaggyAmiba, total, setting1Rates.jaggyAmibaRate) * 100;
    }
    
    return 50;
  }
  
  // 設定6でこの結果が出る確率（通常確率）
  calculateNormalProbability(observedData: any, element: string = 'voice'): number {
    const setting6Rates = this.binomAnalyzer.getExpectedRates(element, 6);
    if (!setting6Rates || observedData.total === 0) return 50;
    
    if (element === 'voice') {
      const { jaggyAmiba, total } = observedData;
      return this.binomAnalyzer.calculateLikelihood(jaggyAmiba, total, setting6Rates.jaggyAmibaRate) * 100;
    }
    
    return 50;
  }
  
  // 判定結果の表現生成
  generateVarianceJudgment(upperVariance: number, normalProb: number) {
    const ratio = normalProb / Math.max(upperVariance, 0.01); // 0除算回避
    const upperFreq = upperVariance > 0 ? Math.round(100 / upperVariance) : 999;
    const normalFreq = normalProb > 0 ? Math.round(100 / normalProb) : 999;
    
    let conclusion = '判断困難';
    if (ratio > 20) {
      conclusion = '実力（統計的確実）';
    } else if (ratio > 10) {
      conclusion = '実力（高確度）';
    } else if (ratio > 5) {
      conclusion = '実力寄り';
    } else if (ratio > 2) {
      conclusion = '若干実力寄り';
    }
    
    return {
      ratio: ratio,
      upperVarianceText: `${upperVariance.toFixed(3)}% (${upperFreq}回に1回の珍事)`,
      normalProbText: `${normalProb.toFixed(2)}% (${normalFreq}回に1回程度)`,
      conclusion: conclusion,
      confidence: ratio > 10 ? 'high' : ratio > 5 ? 'medium' : 'low'
    };
  }
  
  // 複数要素での総合的な上振れ vs 実力分析
  analyzeMultipleElements(evidenceData: any) {
    const elements = Object.keys(evidenceData);
    const analyses: any = {};
    let totalRatio = 1;
    let validElements = 0;
    
    elements.forEach(element => {
      const data = evidenceData[element];
      const upperVariance = this.calculateUpperVarianceProbability(data, element);
      const normalProb = this.calculateNormalProbability(data, element);
      
      if (upperVariance > 0 && normalProb > 0) {
        const judgment = this.generateVarianceJudgment(upperVariance, normalProb);
        analyses[element] = {
          upperVariance,
          normalProb,
          judgment
        };
        
        totalRatio *= judgment.ratio;
        validElements++;
      }
    });
    
    // 総合判定
    const overallRatio = validElements > 0 ? Math.pow(totalRatio, 1/validElements) : 1;
    let overallConclusion = '判断困難';
    
    if (overallRatio > 50) {
      overallConclusion = '複数要素で統計的に高設定確実';
    } else if (overallRatio > 20) {
      overallConclusion = '複数要素で統計的に高設定を強く示唆';
    } else if (overallRatio > 10) {
      overallConclusion = '統計的に高設定を示唆';
    } else if (overallRatio > 5) {
      overallConclusion = '高設定の可能性あり';
    }
    
    return {
      elementAnalyses: analyses,
      overallRatio: overallRatio,
      overallConclusion: overallConclusion,
      validElements: validElements
    };
  }
}

// 統計的分析統合クラス
export class StatisticalAnalysisEngine {
  private binomAnalyzer: BinomialDistributionAnalyzer;
  private varianceAnalyzer: VarianceAnalyzer;

  constructor() {
    this.binomAnalyzer = new BinomialDistributionAnalyzer();
    this.varianceAnalyzer = new VarianceAnalyzer();
  }
  
  // 完全な統計分析を実行
  performCompleteAnalysis(allData: any): StatisticalAnalysis {
    // 証拠データの準備
    const evidenceData = this.prepareEvidenceData(allData);
    
    // 設定別確率計算
    const settingProbabilities = this.binomAnalyzer.calculateSettingProbabilities(evidenceData);
    
    // 確率比計算
    const probabilityRatios = this.binomAnalyzer.calculateProbabilityRatios(settingProbabilities);
    
    // 上振れ vs 実力分析
    const varianceAnalysis = this.varianceAnalyzer.analyzeMultipleElements(evidenceData);
    
    // 統計的結論生成
    const statisticalConclusion = this.generateStatisticalConclusion(
      settingProbabilities, 
      probabilityRatios, 
      varianceAnalysis
    );
    
    return {
      settingProbabilities,
      probabilityRatios,
      varianceAnalysis,
      statisticalConclusion
    };
  }
  
  // 証拠データの準備
  prepareEvidenceData(allData: any): any {
    const evidenceData: any = {};
    
    if (allData.voice && allData.voice.total > 0) {
      evidenceData.voice = {
        jaggyAmiba: (allData.voice.jaggy || 0) + (allData.voice.amiba || 0),
        total: allData.voice.total
      };
    }
    
    if (allData.bell && allData.bell.total > 0) {
      evidenceData.bell = {
        diagonal: allData.bell.diagonal || 0,
        middle: allData.bell.middle || 0,
        total: allData.bell.total
      };
    }
    
    if (allData.watermelon && allData.watermelon.normal.total > 0) {
      evidenceData.watermelon = allData.watermelon;
    }
    
    if (allData.initialHit && allData.initialHit.nonCherryHits > 0) {
      evidenceData.initialHit = allData.initialHit;
    }
    
    if (allData.modeTransition && allData.modeTransition.totalATEnds > 0) {
      evidenceData.modeTransition = allData.modeTransition;
    }
    
    return evidenceData;
  }
  
  // 統計的結論の生成
  generateStatisticalConclusion(probabilities: Record<number, number>, ratios: Record<string, number>, varianceAnalysis: any) {
    const maxProb = Math.max(...Object.values(probabilities));
    const mostLikely = Object.entries(probabilities).find(([_, prob]) => prob === maxProb)?.[0] || '1';
    const highSettingProb = probabilities[5] + probabilities[6];
    
    let recommendation = '様子見';
    let confidenceLevel = 'low';
    let reasoning: string[] = [];
    
    // 確率ベースの判定
    if (maxProb > 70) {
      recommendation = '継続強推奨';
      confidenceLevel = 'very_high';
      reasoning.push(`設定${mostLikely}の可能性が${maxProb.toFixed(1)}%と極めて高い`);
    } else if (maxProb > 50) {
      recommendation = '継続推奨';
      confidenceLevel = 'high';
      reasoning.push(`設定${mostLikely}の可能性が${maxProb.toFixed(1)}%と高い`);
    } else if (highSettingProb > 60) {
      recommendation = '継続推奨';
      confidenceLevel = 'medium';
      reasoning.push(`高設定(5-6)の合計確率が${highSettingProb.toFixed(1)}%`);
    } else if (maxProb < 30 && probabilities[1] + probabilities[2] > 50) {
      recommendation = 'やめ推奨';
      confidenceLevel = 'medium';
      reasoning.push(`低設定(1-2)の合計確率が${(probabilities[1] + probabilities[2]).toFixed(1)}%`);
    }
    
    // 上振れ分析による補強
    if (varianceAnalysis.overallRatio > 20) {
      reasoning.push('複数要素で統計的に高設定を強く示唆');
      if (recommendation === '様子見') recommendation = '継続推奨';
    } else if (varianceAnalysis.overallRatio > 10) {
      reasoning.push('統計的に高設定の可能性が高い');
    }
    
    return {
      mostLikelySetting: mostLikely,
      maxProbability: maxProb,
      highSettingProbability: highSettingProb,
      recommendation: recommendation,
      confidenceLevel: confidenceLevel,
      reasoning: reasoning.join('、'),
      statisticalStrength: varianceAnalysis.overallRatio > 10 ? '強い' : varianceAnalysis.overallRatio > 5 ? '中程度' : '弱い'
    };
  }
}