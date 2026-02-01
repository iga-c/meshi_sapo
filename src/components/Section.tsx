import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

interface SectionProps {
    title: string;
    children: React.ReactNode;
    onAddItem: (item: string) => void;
    isDeleteMode: boolean;
    setIsDeleteMode: (mode: boolean) => void;
    placeholder?: string;
}

export const Section: React.FC<SectionProps> = ({
    title,
    children,
    onAddItem,
    isDeleteMode,
    setIsDeleteMode,
    placeholder = "項目を追加..."
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.trim()) {
            onAddItem(newItem.trim());
            setNewItem("");
            setIsAdding(false);
        }
    };

    return (
        <section className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/60">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                    {title}
                </h2>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsDeleteMode(!isDeleteMode)}
                        className={`p-2 rounded-full transition-colors ${isDeleteMode ? 'bg-red-100 text-red-500' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                        title={isDeleteMode ? "編集を終了" : "項目を削除"}
                    >
                        <Trash2 size={18} />
                    </button>

                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="p-2 rounded-full text-gentle-green bg-green-50 hover:bg-green-100 transition-colors"
                        title="項目を追加"
                    >
                        {isAdding ? <X size={20} /> : <Plus size={20} />}
                    </button>
                </div>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="mb-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder={placeholder}
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gentle-orange/50 bg-white"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gentle-green text-green-800 rounded-xl font-medium hover:bg-green-300 transition-colors"
                        >
                            追加
                        </button>
                    </div>
                </form>
            )}

            <div className="flex flex-wrap gap-3">
                {children}
            </div>
        </section>
    );
};
