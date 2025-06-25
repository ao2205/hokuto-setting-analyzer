import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">北斗設定判別システム</h3>
            <p className="text-gray-300 text-sm">
              統計的手法による科学的設定判別<br />
              冷遇・優遇システム考慮済み
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">機能</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• 二項分布による確率計算</li>
              <li>• 95%信頼区間分析</li>
              <li>• 重要度別要素評価</li>
              <li>• リアルタイム判定</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">注意事項</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• 統計的分析結果です</li>
              <li>• 責任ある判断を心がけてください</li>
              <li>• データの正確性が重要です</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 スマスロ北斗設定判別システム - 統計分析エンジン搭載
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;