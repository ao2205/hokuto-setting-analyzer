import React, { useState, useCallback } from 'react';
import { 
  VoiceData, 
  BellData, 
  WatermelonData, 
  InitialHitData, 
  ModeTransitionData, 
  GameData,
  StatisticalAnalysis,
  TreatmentState
} from './types';
import { StatisticalAnalysisEngine } from './utils/statisticalEngine';
import DataInputPanel from './components/DataInputPanel';
import AnalysisResultsPanel from './components/AnalysisResultsPanel';
import Footer from './components/Footer';

const App: React.FC = () => {
  // データ状態管理
  const [voiceData, setVoiceData] = useState<VoiceData>({
    sin: 0,
    jaggy: 0,
    amiba: 0,
    other: 0,
    total: 0
  });

  const [bellData, setBellData] = useState<BellData>({
    diagonal: 0,
    middle: 0,
    total: 0
  });

  const [watermelonData, setWatermelonData] = useState<WatermelonData>({
    normal: { total: 0, hit: 0 },
    heaven: { total: 0, hit: 0, consecutiveMiss: 0 }
  });

  const [initialHitData, setInitialHitData] = useState<InitialHitData>({
    totalGames: 0,
    totalHits: 0,
    cherryHits: 0,
    nonCherryHits: 0
  });

  const [modeTransitionData, setModeTransitionData] = useState<ModeTransitionData>({
    totalATEnds: 0,
    jagiStageStarts: 0,
    heavenStarts: 0
  });

  const [gameData, setGameData] = useState<GameData>({
    currentGames: 0,
    totalDifference: 0,
    state: 'normal'
  });

  // 分析結果状態
  const [analysisResult, setAnalysisResult] = useState<StatisticalAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 冷遇・優遇状態判定
  const determineState = useCallback((difference: number): TreatmentState => {
    if (difference <= -1500) return 'cold';
    if (difference >= 1500) return 'hot';
    return 'normal';
  }, []);

  // ゲームデータ更新時の状態判定
  const updateGameData = useCallback((games: number, difference: number) => {
    const state = determineState(difference);
    setGameData({
      currentGames: games,
      totalDifference: difference,
      state
    });
  }, [determineState]);

  // データ検証関数
  const validateData = useCallback(() => {
    const errors: string[] = [];
    
    // 基本データ検証
    if (gameData.currentGames < 0) {
      errors.push('ゲーム数は0以上で入力してください');
    }
    
    // ボイスデータ検証
    const voiceTotal = voiceData.sin + voiceData.jaggy + voiceData.amiba + voiceData.other;
    if (voiceTotal !== voiceData.total && voiceData.total > 0) {
      errors.push('ボイス合計数が一致しません');
    }
    
    // ベルデータ検証
    const bellTotal = bellData.diagonal + bellData.middle;
    if (bellTotal !== bellData.total && bellData.total > 0) {
      errors.push('ベル合計数が一致しません');
    }
    
    // 初当たりデータ検証
    if (initialHitData.cherryHits + initialHitData.nonCherryHits !== initialHitData.totalHits && initialHitData.totalHits > 0) {
      errors.push('初当たり回数の内訳が一致しません');
    }
    
    return errors;
  }, [voiceData, bellData, initialHitData, gameData]);

  // 分析実行
  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // データ検証
      const errors = validateData();
      if (errors.length > 0) {
        alert('データエラー:\n' + errors.join('\n'));
        return;
      }
      
      // 分析データ準備
      const analysisData = {
        voice: {
          ...voiceData,
          total: voiceData.sin + voiceData.jaggy + voiceData.amiba + voiceData.other
        },
        bell: {
          ...bellData,
          total: bellData.diagonal + bellData.middle
        },
        watermelon: watermelonData,
        initialHit: initialHitData,
        modeTransition: modeTransitionData,
        game: gameData
      };
      
      // 統計分析実行
      const engine = new StatisticalAnalysisEngine();
      const result = engine.performCompleteAnalysis(analysisData);
      
      setAnalysisResult(result);
      
    } catch (error) {
      console.error('分析エラー:', error);
      alert('分析中にエラーが発生しました。データを確認してください。');
    } finally {
      setIsAnalyzing(false);
    }
  }, [voiceData, bellData, watermelonData, initialHitData, modeTransitionData, gameData, validateData]);

  // データリセット
  const resetData = useCallback(() => {
    setVoiceData({ sin: 0, jaggy: 0, amiba: 0, other: 0, total: 0 });
    setBellData({ diagonal: 0, middle: 0, total: 0 });
    setWatermelonData({
      normal: { total: 0, hit: 0 },
      heaven: { total: 0, hit: 0, consecutiveMiss: 0 }
    });
    setInitialHitData({ totalGames: 0, totalHits: 0, cherryHits: 0, nonCherryHits: 0 });
    setModeTransitionData({ totalATEnds: 0, jagiStageStarts: 0, heavenStarts: 0 });
    setGameData({ currentGames: 0, totalDifference: 0, state: 'normal' });
    setAnalysisResult(null);
  }, []);

  // データエクスポート
  const exportData = useCallback(() => {
    const exportData = {
      timestamp: new Date().toISOString(),
      gameData,
      voiceData,
      bellData,
      watermelonData,
      initialHitData,
      modeTransitionData,
      analysisResult
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `hokuto-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [gameData, voiceData, bellData, watermelonData, initialHitData, modeTransitionData, analysisResult]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <main className="w-full max-w-6xl px-2 sm:px-4 py-4 sm:py-8">
        {/* タイトルセクション */}
        <div className="text-center mb-6 sm:mb-12">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 mb-4 sm:mb-8 border-2 sm:border-4 border-red-200 mx-auto max-w-4xl">
            <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">🎯</div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-2 sm:mb-4">
              スマスロ北斗の拳 設定判別システム
            </h1>
            <p className="text-gray-600 text-sm sm:text-lg md:text-xl mb-2">統計的分析による高精度設定判別</p>
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 mt-2 sm:mt-4">
              <span className="px-2 sm:px-4 py-1 sm:py-2 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm font-medium">
                v2.0
              </span>
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-400 rounded-full" title="システム正常"></div>
            </div>
          </div>
        </div>

        {/* データ入力パネル */}
        <div className="flex justify-center mb-6 sm:mb-12">
          <div className="w-full max-w-5xl">
            <DataInputPanel
              voiceData={voiceData}
              setVoiceData={setVoiceData}
              bellData={bellData}
              setBellData={setBellData}
              watermelonData={watermelonData}
              setWatermelonData={setWatermelonData}
              initialHitData={initialHitData}
              setInitialHitData={setInitialHitData}
              modeTransitionData={modeTransitionData}
              setModeTransitionData={setModeTransitionData}
              gameData={gameData}
              updateGameData={updateGameData}
              onReset={resetData}
              onExport={exportData}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>

        {/* 分析実行セクション - モバイル最適化ボタン */}
        <div className="flex justify-center mb-6 sm:mb-12">
          <div className="w-full max-w-3xl text-center px-2 sm:px-0">
            <button
              className="analyze-button w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 
                         hover:from-red-600 hover:via-red-700 hover:to-red-800
                         text-white font-black py-4 sm:py-8 px-6 sm:px-16 rounded-2xl sm:rounded-3xl text-lg sm:text-4xl
                         shadow-2xl transform hover:scale-105 transition-all duration-300
                         border-4 sm:border-8 border-red-300 hover:border-red-200
                         relative overflow-hidden group
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                         min-h-[60px] sm:min-h-[80px]"
              onClick={runAnalysis}
              disabled={isAnalyzing}
            >
              {/* ボタン内のアニメーション効果 */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent 
                               opacity-30 transform skew-x-12 -translate-x-full group-hover:translate-x-full 
                               transition-transform duration-1000"></span>
              
              {/* ボタンテキスト */}
              <span className="relative z-10 flex items-center justify-center">
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 sm:mr-4 h-6 sm:h-12 w-6 sm:w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm sm:text-4xl">分析実行中...</span>
                  </>
                ) : (
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className="text-2xl sm:text-5xl">🔥</span>
                    <span className="text-lg sm:text-4xl font-black">設定を分析する</span>
                    <span className="text-2xl sm:text-5xl">🔥</span>
                  </div>
                )}
              </span>
            </button>
            
            {/* ボタン下の説明テキスト */}
            <p className="mt-3 sm:mt-6 text-gray-700 text-sm sm:text-xl font-semibold">
              入力されたデータを基に設定を推定します
            </p>
          </div>
        </div>

        {/* 分析結果パネル */}
        <div className="flex justify-center mb-4 sm:mb-0">
          <div className="w-full max-w-5xl">
            <AnalysisResultsPanel
              analysisResult={analysisResult}
              gameData={gameData}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;