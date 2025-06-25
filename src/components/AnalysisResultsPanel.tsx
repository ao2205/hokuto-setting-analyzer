import React from 'react';
import { StatisticalAnalysis, GameData } from '../types';

interface Props {
  analysisResult: StatisticalAnalysis | null;
  gameData: GameData;
  isAnalyzing: boolean;
}

const AnalysisResultsPanel: React.FC<Props> = ({
  analysisResult,
  gameData,
  isAnalyzing
}) => {
  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">統計分析実行中...</p>
        <p className="text-sm text-gray-500">二項分布による確率計算</p>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-gray-600 mb-2">分析を実行してください</p>
        <p className="text-sm text-gray-500">データ入力後、「分析実行」ボタンをクリック</p>
      </div>
    </div>
  );

  const getRecommendationStyle = (recommendation: string) => {
    if (recommendation.includes('継続')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (recommendation.includes('やめ')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getConfidenceBadge = (confidenceLevel: string) => {
    const styles = {
      'very_high': 'bg-emerald-100 text-emerald-800',
      'high': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-red-100 text-red-800'
    };
    
    const labels = {
      'very_high': '非常に高い',
      'high': '高い',
      'medium': '中程度',
      'low': '低い'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[confidenceLevel as keyof typeof styles] || styles.low}`}>
        信頼度: {labels[confidenceLevel as keyof typeof labels] || '不明'}
      </span>
    );
  };

  const renderSettingProbabilities = () => {
    if (!analysisResult) return null;

    const { settingProbabilities } = analysisResult;
    const maxProb = Math.max(...Object.values(settingProbabilities));

    return (
      <div className="section">
        <h4 className="text-lg font-semibold mb-4">📊 設定別可能性</h4>
        <div className="space-y-3">
          {Object.entries(settingProbabilities)
            .sort(([,a], [,b]) => b - a)
            .map(([setting, probability]) => (
              <div key={setting} className="flex items-center space-x-3">
                <span className="w-12 text-sm font-medium">設定{setting}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      probability === maxProb ? 'bg-primary-600' : 'bg-gray-400'
                    }`}
                    style={{ width: `${Math.max(probability, 2)}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {probability.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderProbabilityRatios = () => {
    if (!analysisResult) return null;

    const { probabilityRatios, settingProbabilities } = analysisResult;
    const highSettingProb = settingProbabilities[5] + settingProbabilities[6];
    const lowSettingProb = settingProbabilities[1] + settingProbabilities[2];

    return (
      <div className="section">
        <h4 className="text-lg font-semibold mb-4">📈 確率比較</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">設定6 vs 設定1</div>
            <div className="text-xl font-bold text-primary-600">
              {probabilityRatios['6vs1']?.toFixed(1) || 'N/A'}倍
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">設定6 vs 設定4</div>
            <div className="text-xl font-bold text-primary-600">
              {probabilityRatios['6vs4']?.toFixed(1) || 'N/A'}倍
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">高設定(5-6)</div>
            <div className="text-xl font-bold text-green-600">
              {highSettingProb.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">低設定(1-2)</div>
            <div className="text-xl font-bold text-red-600">
              {lowSettingProb.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVarianceAnalysis = () => {
    if (!analysisResult) return null;

    const { varianceAnalysis } = analysisResult;

    return (
      <div className="section">
        <h4 className="text-lg font-semibold mb-4">🔬 上振れ vs 実力分析</h4>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">総合判定</span>
            <span className="text-xs text-blue-600">
              検証要素: {varianceAnalysis.validElements}個
            </span>
          </div>
          <div className="text-lg font-bold text-blue-900 mb-2">
            {varianceAnalysis.overallConclusion}
          </div>
          <div className="text-sm text-blue-700">
            統計的根拠の強さ: {analysisResult.statisticalConclusion.statisticalStrength}
          </div>
        </div>
      </div>
    );
  };

  const renderStatisticalConclusion = () => {
    if (!analysisResult) return null;

    const { statisticalConclusion } = analysisResult;

    return (
      <div className="section">
        <h4 className="text-lg font-semibold mb-4">🎯 統計的結論</h4>
        
        {/* 推奨行動 */}
        <div className={`p-4 rounded-lg border-2 mb-4 ${getRecommendationStyle(statisticalConclusion.recommendation)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold">
              {statisticalConclusion.recommendation}
            </span>
            {getConfidenceBadge(statisticalConclusion.confidenceLevel)}
          </div>
          <div className="text-sm">
            最有力: 設定{statisticalConclusion.mostLikelySetting} ({statisticalConclusion.maxProbability.toFixed(1)}%)
          </div>
        </div>

        {/* 根拠 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-semibold mb-2">統計的根拠:</h5>
          <p className="text-sm text-gray-700">
            {statisticalConclusion.reasoning}
          </p>
        </div>
      </div>
    );
  };

  const renderGameStatus = () => {
    const getStateIcon = (state: string) => {
      switch (state) {
        case 'cold': return '❄️';
        case 'hot': return '🔥';
        default: return '🔄';
      }
    };

    const getStateText = (state: string) => {
      switch (state) {
        case 'cold': return '冷遇状態';
        case 'hot': return '優遇状態';
        default: return '通常状態';
      }
    };

    return (
      <div className="section">
        <h4 className="text-lg font-semibold mb-4">🎮 現在の状況</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900">
              {gameData.currentGames.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">ゲーム数</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className={`text-2xl font-bold ${gameData.totalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {gameData.totalDifference >= 0 ? '+' : ''}{gameData.totalDifference.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">差枚数</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white border rounded-lg text-center">
          <div className="text-2xl mb-1">{getStateIcon(gameData.state)}</div>
          <div className="font-semibold">{getStateText(gameData.state)}</div>
          <div className="text-xs text-gray-500 mt-1">
            冷遇: -1500枚以下 | 優遇: +1500枚以上
          </div>
        </div>
      </div>
    );
  };

  if (isAnalyzing) {
    return (
      <div className="panel">
        <h2 className="text-xl font-bold mb-6">📈 分析結果</h2>
        {renderLoadingState()}
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="panel">
        <h2 className="text-xl font-bold mb-6">📈 分析結果</h2>
        {renderEmptyState()}
        {renderGameStatus()}
      </div>
    );
  }

  return (
    <div className="panel">
      <h2 className="text-xl font-bold mb-6">📈 分析結果</h2>
      
      {renderStatisticalConclusion()}
      {renderSettingProbabilities()}
      {renderProbabilityRatios()}
      {renderVarianceAnalysis()}
      {renderGameStatus()}
      
      {/* 注意事項 */}
      <div className="section">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h5 className="font-semibold text-yellow-800 mb-2">⚠️ 重要な注意事項</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 統計的分析結果であり、確実な予測ではありません</li>
            <li>• データの正確性が分析精度に大きく影響します</li>
            <li>• 冷遇・優遇状態を考慮した総合判断を行ってください</li>
            <li>• 責任ある遊技を心がけてください</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultsPanel;