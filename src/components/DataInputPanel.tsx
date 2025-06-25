import React, { useState } from 'react';
import { 
  VoiceData, 
  BellData, 
  WatermelonData, 
  InitialHitData, 
  ModeTransitionData, 
  GameData 
} from '../types';
import { testScenarios, loadTestScenario } from '../utils/testData';

interface Props {
  voiceData: VoiceData;
  setVoiceData: React.Dispatch<React.SetStateAction<VoiceData>>;
  bellData: BellData;
  setBellData: React.Dispatch<React.SetStateAction<BellData>>;
  watermelonData: WatermelonData;
  setWatermelonData: React.Dispatch<React.SetStateAction<WatermelonData>>;
  initialHitData: InitialHitData;
  setInitialHitData: React.Dispatch<React.SetStateAction<InitialHitData>>;
  modeTransitionData: ModeTransitionData;
  setModeTransitionData: React.Dispatch<React.SetStateAction<ModeTransitionData>>;
  gameData: GameData;
  updateGameData: (games: number, difference: number) => void;
  onReset: () => void;
  onExport: () => void;
  isAnalyzing: boolean;
}

const DataInputPanel: React.FC<Props> = ({
  voiceData,
  setVoiceData,
  bellData,
  setBellData,
  watermelonData,
  setWatermelonData,
  initialHitData,
  setInitialHitData,
  modeTransitionData,
  setModeTransitionData,
  gameData,
  updateGameData,
  onReset,
  onExport,
  isAnalyzing
}) => {
  // テストデータ選択状態
  const [showTestData, setShowTestData] = useState(false);

  // ボイス合計自動計算
  const updateVoiceTotal = (newData: Partial<VoiceData>) => {
    const updated = { ...voiceData, ...newData };
    const total = updated.sin + updated.jaggy + updated.amiba + updated.other;
    setVoiceData({ ...updated, total });
  };

  // ベル合計自動計算
  const updateBellTotal = (newData: Partial<BellData>) => {
    const updated = { ...bellData, ...newData };
    const total = updated.diagonal + updated.middle;
    setBellData({ ...updated, total });
  };

  // 初当たりデータ自動計算
  const updateInitialHitTotal = (newData: Partial<InitialHitData>) => {
    const updated = { ...initialHitData, ...newData };
    const totalHits = updated.cherryHits + updated.nonCherryHits;
    setInitialHitData({ ...updated, totalHits });
  };

  // 状態表示用のスタイル
  const getStateStyle = (state: string) => {
    switch (state) {
      case 'cold':
        return 'text-blue-600 bg-blue-100';
      case 'hot':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStateText = (state: string) => {
    switch (state) {
      case 'cold':
        return '冷遇状態';
      case 'hot':
        return '優遇状態';
      default:
        return '通常状態';
    }
  };

  return (
    <div className="panel">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        📊 データ入力
        <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${getStateStyle(gameData.state)}`}>
          {getStateText(gameData.state)}
        </span>
      </h2>

      {/* ゲーム情報 */}
      <div className="section">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          🎮 ゲーム情報
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="currentGames" className="block text-sm font-medium text-gray-700 mb-2">
              現在ゲーム数
            </label>
            <div className="flex">
              <input
                type="number"
                id="currentGames"
                className="input-field rounded-r-none"
                value={gameData.currentGames}
                onChange={(e) => updateGameData(Number(e.target.value), gameData.totalDifference)}
                min="0"
              />
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                G
              </span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="totalDifference" className="block text-sm font-medium text-gray-700 mb-2">
              差枚数
            </label>
            <div className="flex">
              <input
                type="number"
                id="totalDifference"
                className="input-field rounded-r-none"
                value={gameData.totalDifference}
                onChange={(e) => updateGameData(gameData.currentGames, Number(e.target.value))}
              />
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                枚
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ボイス情報 */}
      <div className="section">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          🎤 ボイス情報 <span className="ml-2 importance-stars">★★★★★</span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">シン系</label>
            <input
              type="number"
              className="input-field"
              value={voiceData.sin}
              onChange={(e) => updateVoiceTotal({ sin: Number(e.target.value) })}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">ジャギ系</label>
            <input
              type="number"
              className="input-field"
              value={voiceData.jaggy}
              onChange={(e) => updateVoiceTotal({ jaggy: Number(e.target.value) })}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">アミバ系</label>
            <input
              type="number"
              className="input-field"
              value={voiceData.amiba}
              onChange={(e) => updateVoiceTotal({ amiba: Number(e.target.value) })}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">その他</label>
            <input
              type="number"
              className="input-field"
              value={voiceData.other}
              onChange={(e) => updateVoiceTotal({ other: Number(e.target.value) })}
              min="0"
            />
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            合計: <span className="font-semibold">{voiceData.total}回</span>
            {voiceData.total > 0 && (
              <span className="ml-4">
                特殊率: <span className="font-semibold">
                  {((voiceData.jaggy + voiceData.amiba) / voiceData.total * 100).toFixed(1)}%
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ベル情報 */}
      <div className="section">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          🔔 ベル情報 <span className="ml-2 importance-stars">★★★★☆</span>
        </h3>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
          💎 斜めベル: レア（少ない） | 🔔 中段ベル: 通常（多い）<br />
          理論比率 - 設定1: 1:11, 設定6: 1:6.5
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">斜めベル</label>
            <input
              type="number"
              className="input-field"
              value={bellData.diagonal}
              onChange={(e) => updateBellTotal({ diagonal: Number(e.target.value) })}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">中段ベル</label>
            <input
              type="number"
              className="input-field"
              value={bellData.middle}
              onChange={(e) => updateBellTotal({ middle: Number(e.target.value) })}
              min="0"
            />
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            合計: <span className="font-semibold">{bellData.total}回</span>
            {bellData.total > 0 && bellData.diagonal > 0 && bellData.middle > 0 && (
              <span className="ml-4">
                現在比率: <span className="font-semibold">
                  1:{(bellData.diagonal / bellData.middle).toFixed(1)}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 初当たり情報 */}
      <div className="section">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          🎯 初当たり情報 <span className="ml-2 importance-stars">★★★☆☆</span>
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">中段チェリー当選回数</label>
            <input
              type="number"
              className="input-field"
              value={initialHitData.cherryHits}
              onChange={(e) => updateInitialHitTotal({ cherryHits: Number(e.target.value) })}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">その他当選回数</label>
            <input
              type="number"
              className="input-field"
              value={initialHitData.nonCherryHits}
              onChange={(e) => updateInitialHitTotal({ nonCherryHits: Number(e.target.value) })}
              min="0"
            />
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            総当選回数: <span className="font-semibold">{initialHitData.totalHits}回</span>
            {initialHitData.totalHits > 0 && gameData.currentGames > 0 && (
              <span className="ml-4">
                初当たり確率: <span className="font-semibold">
                  1/{Math.round(gameData.currentGames / initialHitData.totalHits)}
                </span>
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ※ 中段チェリー除外の通常初当たり確率で設定判別
          </div>
        </div>
      </div>

      {/* モード移行情報 */}
      <div className="section">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          🎭 モード移行情報 <span className="ml-2 importance-stars">★★★☆☆</span>
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">AT終了回数</label>
            <input
              type="number"
              className="input-field"
              value={modeTransitionData.totalATEnds}
              onChange={(e) => setModeTransitionData(prev => ({ ...prev, totalATEnds: Number(e.target.value) }))}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">ジャギステージスタート回数</label>
            <input
              type="number"
              className="input-field"
              value={modeTransitionData.jagiStageStarts}
              onChange={(e) => setModeTransitionData(prev => ({ ...prev, jagiStageStarts: Number(e.target.value) }))}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">天国移行回数</label>
            <input
              type="number"
              className="input-field"
              value={modeTransitionData.heavenStarts}
              onChange={(e) => setModeTransitionData(prev => ({ ...prev, heavenStarts: Number(e.target.value) }))}
              min="0"
            />
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
          💡 ジャギステージスタート = 50%で天国移行<br />
          📊 設定1: 17.6%天国 → 設定6: 27.9%天国
        </div>
      </div>

      {/* テストデータ選択 */}
      {showTestData && (
        <div className="section">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🧪 テストデータ選択
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {testScenarios.map((scenario, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                   onClick={() => {
                     loadTestScenario(
                       index,
                       setVoiceData,
                       setBellData,
                       setWatermelonData,
                       setInitialHitData,
                       setModeTransitionData,
                       updateGameData
                     );
                     setShowTestData(false);
                   }}>
                <div className="font-semibold text-gray-900">{scenario.name}</div>
                <div className="text-sm text-gray-600 mt-1">{scenario.description}</div>
                <div className="text-xs text-blue-600 mt-2">期待結果: {scenario.expectedResult}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowTestData(false)}
            className="mt-4 btn btn-secondary w-full"
          >
            閉じる
          </button>
        </div>
      )}

      {/* アクションボタン */}
      <div className="space-y-4 mt-8">
        <div className="flex space-x-4">
          <button
            onClick={onReset}
            disabled={isAnalyzing}
            className="btn btn-secondary flex-1"
          >
            🔄 リセット
          </button>
          
          <button
            onClick={onExport}
            disabled={isAnalyzing}
            className="btn btn-secondary"
          >
            📤 エクスポート
          </button>
        </div>
        
        <button
          onClick={() => setShowTestData(!showTestData)}
          disabled={isAnalyzing}
          className="btn btn-secondary w-full flex items-center justify-center space-x-2"
        >
          <span>🧪</span>
          <span>{showTestData ? 'テストデータを閉じる' : 'テストデータを読込'}</span>
        </button>
      </div>
    </div>
  );
};

export default DataInputPanel;