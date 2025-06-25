// テストデータ生成ユーティリティ
import { 
  VoiceData, 
  BellData, 
  WatermelonData, 
  InitialHitData, 
  ModeTransitionData, 
  GameData 
} from '../types';

export interface TestScenario {
  name: string;
  description: string;
  expectedResult: string;
  voiceData: VoiceData;
  bellData: BellData;
  watermelonData: WatermelonData;
  initialHitData: InitialHitData;
  modeTransitionData: ModeTransitionData;
  gameData: GameData;
}

export const testScenarios: TestScenario[] = [
  {
    name: "高設定複合パターン",
    description: "設定6を強く示唆する複数要素が揃ったケース",
    expectedResult: "設定6（継続強推奨）",
    voiceData: {
      sin: 20,
      jaggy: 12,
      amiba: 8,
      other: 10,
      total: 50
    },
    bellData: {
      diagonal: 80,
      middle: 15,
      total: 95
    },
    watermelonData: {
      normal: { total: 25, hit: 5 },
      heaven: { total: 8, hit: 3, consecutiveMiss: 2 }
    },
    initialHitData: {
      totalGames: 1500,
      totalHits: 6,
      cherryHits: 2,
      nonCherryHits: 4
    },
    modeTransitionData: {
      totalATEnds: 6,
      jagiStageStarts: 3,
      heavenStarts: 2
    },
    gameData: {
      currentGames: 1500,
      totalDifference: 800,
      state: 'hot'
    }
  },
  {
    name: "低設定示唆パターン", 
    description: "設定1-2を示唆する要素が多いケース",
    expectedResult: "設定1-2（やめ推奨）",
    voiceData: {
      sin: 25,
      jaggy: 3,
      amiba: 2,
      other: 20,
      total: 50
    },
    bellData: {
      diagonal: 5,
      middle: 55,
      total: 60
    },
    watermelonData: {
      normal: { total: 30, hit: 4 },
      heaven: { total: 5, hit: 0, consecutiveMiss: 5 }
    },
    initialHitData: {
      totalGames: 2000,
      totalHits: 3,
      cherryHits: 1,
      nonCherryHits: 2
    },
    modeTransitionData: {
      totalATEnds: 3,
      jagiStageStarts: 0,
      heavenStarts: 0
    },
    gameData: {
      currentGames: 2000,
      totalDifference: -800,
      state: 'cold'
    }
  },
  {
    name: "矛盾要素パターン",
    description: "ボイスは高設定示唆だがベルは低設定示唆の矛盾ケース",
    expectedResult: "設定4-5（様子見）",
    voiceData: {
      sin: 15,
      jaggy: 8,
      amiba: 7,
      other: 20,
      total: 50
    },
    bellData: {
      diagonal: 6,
      middle: 66,
      total: 72
    },
    watermelonData: {
      normal: { total: 20, hit: 3 },
      heaven: { total: 3, hit: 1, consecutiveMiss: 2 }
    },
    initialHitData: {
      totalGames: 1200,
      totalHits: 4,
      cherryHits: 1,
      nonCherryHits: 3
    },
    modeTransitionData: {
      totalATEnds: 4,
      jagiStageStarts: 1,
      heavenStarts: 1
    },
    gameData: {
      currentGames: 1200,
      totalDifference: 200,
      state: 'normal'
    }
  },
  {
    name: "データ不足パターン",
    description: "少ないサンプル数でのテスト",
    expectedResult: "判断困難（データ不足）",
    voiceData: {
      sin: 5,
      jaggy: 2,
      amiba: 1,
      other: 2,
      total: 10
    },
    bellData: {
      diagonal: 2,
      middle: 18,
      total: 20
    },
    watermelonData: {
      normal: { total: 5, hit: 1 },
      heaven: { total: 1, hit: 0, consecutiveMiss: 1 }
    },
    initialHitData: {
      totalGames: 500,
      totalHits: 1,
      cherryHits: 0,
      nonCherryHits: 1
    },
    modeTransitionData: {
      totalATEnds: 1,
      jagiStageStarts: 0,
      heavenStarts: 0
    },
    gameData: {
      currentGames: 500,
      totalDifference: -200,
      state: 'normal'
    }
  }
];

// プリセットデータ読み込み関数
export const loadTestScenario = (
  scenarioIndex: number,
  setVoiceData: React.Dispatch<React.SetStateAction<VoiceData>>,
  setBellData: React.Dispatch<React.SetStateAction<BellData>>,
  setWatermelonData: React.Dispatch<React.SetStateAction<WatermelonData>>,
  setInitialHitData: React.Dispatch<React.SetStateAction<InitialHitData>>,
  setModeTransitionData: React.Dispatch<React.SetStateAction<ModeTransitionData>>,
  updateGameData: (games: number, difference: number) => void
) => {
  if (scenarioIndex < 0 || scenarioIndex >= testScenarios.length) {
    console.error('Invalid scenario index');
    return;
  }

  const scenario = testScenarios[scenarioIndex];
  
  setVoiceData(scenario.voiceData);
  setBellData(scenario.bellData);
  setWatermelonData(scenario.watermelonData);
  setInitialHitData(scenario.initialHitData);
  setModeTransitionData(scenario.modeTransitionData);
  updateGameData(scenario.gameData.currentGames, scenario.gameData.totalDifference);
};

// エラー防止システムの検証データ
export const errorPreventionTests = [
  {
    name: "冷遇状態での継続率判別無効化テスト",
    description: "差枚-1500以下で継続率データが判別要素から除外されることを確認",
    data: {
      gameData: { currentGames: 1000, totalDifference: -2000, state: 'cold' as const },
      expectedBehavior: "継続率データは設定判別要素として無視される"
    }
  },
  {
    name: "優遇状態での統計補正テスト", 
    description: "差枚+1500以上でボイス等の確率が補正されることを確認",
    data: {
      gameData: { currentGames: 1000, totalDifference: 2000, state: 'hot' as const },
      expectedBehavior: "ボイス分析等に優遇補正が適用される"
    }
  },
  {
    name: "★☆☆☆☆要素の重視防止テスト",
    description: "低重要度要素が過度に重視されないことを確認",
    data: {
      importance: "low",
      expectedBehavior: "重み付けが適切に制限される"
    }
  }
];

const testDataExports = { testScenarios, loadTestScenario, errorPreventionTests };
export default testDataExports;