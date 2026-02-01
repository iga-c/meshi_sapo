import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChefHat, Copy, Check } from 'lucide-react';

interface RecipeCardProps {
    content: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ content }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3 text-gentle-orange">
                    <div className="p-2 bg-orange-50 rounded-full">
                        <ChefHat size={28} />
                    </div>
                    <span className="font-bold text-lg text-gray-700">ご提案レシピ</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-gentle-orange transition-colors flex items-center gap-1 text-sm"
                    title="コピー"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "コピー完了" : "コピー"}
                </button>
            </div>

            <div className="prose prose-orange max-w-none text-gray-700 leading-relaxed">
                <ReactMarkdown
                    components={{
                        h1: ({ ...props }) => <h1 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-gentle-orange pl-3" {...props} />,
                        h2: ({ ...props }) => <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3 flex items-center gap-2" {...props} />,
                        h3: ({ ...props }) => <h3 className="text-lg font-bold text-gray-800 mt-4 mb-2" {...props} />,
                        ul: ({ ...props }) => <ul className="list-disc list-inside space-y-1 my-3 bg-orange-50/50 p-4 rounded-xl" {...props} />,
                        ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-2 my-3 pl-2" {...props} />,
                        li: ({ ...props }) => <li className="text-gray-700" {...props} />,
                        strong: ({ ...props }) => <strong className="text-gentle-orange font-bold" {...props} />,
                        p: ({ ...props }) => <p className="mb-4" {...props} />,
                        table: ({ ...props }) => <div className="overflow-x-auto my-6 rounded-xl border border-orange-100 shadow-sm"><table className="w-full text-left text-sm text-gray-600" {...props} /></div>,
                        thead: ({ ...props }) => <thead className="bg-orange-50 text-gray-700 font-bold" {...props} />,
                        tbody: ({ ...props }) => <tbody className="divide-y divide-orange-50 bg-white" {...props} />,
                        tr: ({ ...props }) => <tr className="hover:bg-orange-50/30 transition-colors" {...props} />,
                        th: ({ ...props }) => <th className="px-4 py-3 font-semibold text-gray-700" {...props} />,
                        td: ({ ...props }) => <td className="px-4 py-3" {...props} />,
                    }}
                    remarkPlugins={[remarkGfm]}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
};
