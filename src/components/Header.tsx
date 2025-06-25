import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-lg border-b-2 border-hokuto-gold">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">🎯</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                スマスロ北斗の拳 設定判別システム
              </h1>
              <p className="text-sm text-gray-600">
                統計的分析による高精度設定判別
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              v2.0
            </span>
            <div className="w-3 h-3 bg-green-400 rounded-full" title="システム正常"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;