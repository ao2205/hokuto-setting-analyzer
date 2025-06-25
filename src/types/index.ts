export interface VoiceData {
  sin: number;
  jaggy: number;
  amiba: number;
  other: number;
  total: number;
}

export interface BellData {
  diagonal: number;
  middle: number;
  total: number;
}

export interface WatermelonData {
  normal: {
    total: number;
    hit: number;
  };
  heaven: {
    total: number;
    hit: number;
    consecutiveMiss: number;
  };
}

export interface InitialHitData {
  totalGames: number;
  totalHits: number;
  cherryHits: number;
  nonCherryHits: number;
}

export interface ModeTransitionData {
  totalATEnds: number;
  jagiStageStarts: number;
  heavenStarts: number;
}

export interface GameData {
  currentGames: number;
  totalDifference: number;
  state: 'cold' | 'normal' | 'hot';
}

export interface AnalysisResult {
  estimatedSetting: string;
  confidence: number;
  reasoning: string;
  score: number;
}

export interface ComponentScore {
  score: number;
  confidence: number;
  setting?: string;
  reasoning: string;
}

export interface IntegratedAnalysisResult {
  finalScore: number;
  confidence: number;
  state: string;
  components: {
    voice: ComponentScore;
    bell: ComponentScore;
    initialHit: ComponentScore;
    heaven: ComponentScore;
    modeTransition: ComponentScore;
    game: ComponentScore;
  };
  gameData: GameData;
}

export interface StatisticalAnalysis {
  settingProbabilities: Record<number, number>;
  probabilityRatios: Record<string, number>;
  varianceAnalysis: {
    overallRatio: number;
    overallConclusion: string;
    validElements: number;
  };
  statisticalConclusion: {
    mostLikelySetting: string;
    maxProbability: number;
    highSettingProbability: number;
    recommendation: string;
    confidenceLevel: string;
    reasoning: string;
    statisticalStrength: string;
  };
}

export type Setting = '1' | '2' | '4' | '5' | '6';
export type ColdHotState = 'cold' | 'normal' | 'hot';
export type TreatmentState = 'cold' | 'hot' | 'normal';