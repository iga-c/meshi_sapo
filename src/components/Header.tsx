import React, { useState } from 'react';
import { Settings, Key } from 'lucide-react';

interface HeaderProps {
    apiKey: string;
    setApiKey: (key: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ apiKey, setApiKey }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempKey, setTempKey] = useState(apiKey);

    const handleSave = () => {
        setApiKey(tempKey);
        setIsOpen(false);
    };

    return (
        <header className="flex justify-between items-center py-6 px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                めし<span className="text-gentle-orange">サポ</span>
            </h1>

            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-2 rounded-xl transition-all ${apiKey ? 'bg-white text-gentle-green shadow-sm' : 'bg-gentle-orange text-white animate-pulse'
                        }`}
                    title="設定"
                >
                    <Settings size={24} />
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl p-4 z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        <h3 className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
                            <Key size={16} /> APIキー設定
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">
                            Google Gemini APIキーを入力してください。<br />
                            <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-gentle-orange hover:underline">
                                APIキーを取得する
                            </a><br />
                            ※ブラウザを閉じるとリセットされます（安全設計）。
                        </p>
                        <input
                            type="password"
                            value={tempKey}
                            onChange={(e) => setTempKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-gentle-orange/50"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 text-sm px-3 py-1 hover:bg-gray-100 rounded-lg"
                            >
                                閉じる
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-gentle-orange text-white text-sm px-4 py-1.5 rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
