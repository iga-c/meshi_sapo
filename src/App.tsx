import { useState } from 'react';
import { Header } from './components/Header';
import { Section } from './components/Section';
import { Chip } from './components/Chip';
import { RecipeCard } from './components/RecipeCard';
import { useApiKey, useLocalStorageList, DEFAULT_INGREDIENTS, DEFAULT_CONDITIONS, useHistory, type HistoryItem } from './utils/storage';
import { buildPrompt } from './utils/promptBuilder';
import { generateRecipe } from './utils/gemini';
import { Sparkles, History as HistoryIcon, Loader2 } from 'lucide-react';

function App() {
  const [apiKey, setApiKey] = useApiKey();

  // Data State
  const { list: ingredients, addItem: addIngredient, removeItem: removeIngredient } = useLocalStorageList('ingredients', DEFAULT_INGREDIENTS);
  const { list: conditions, addItem: addCondition, removeItem: removeCondition } = useLocalStorageList('conditions', DEFAULT_CONDITIONS);
  const { history, addHistory, removeHistory } = useHistory();

  // UI State
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [isDeleteModeIngredients, setIsDeleteModeIngredients] = useState(false);
  const [isDeleteModeConditions, setIsDeleteModeConditions] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<{ content: string, type: 'recipe' | 'prompt' } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Toggle Selection
  const toggleIngredient = (item: string) => {
    if (isDeleteModeIngredients) {
      removeIngredient(item);
      setSelectedIngredients(prev => prev.filter(i => i !== item));
    } else {
      setSelectedIngredients(prev =>
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    }
  };

  const toggleCondition = (item: string) => {
    if (isDeleteModeConditions) {
      removeCondition(item);
      setSelectedConditions(prev => prev.filter(i => i !== item));
    } else {
      setSelectedConditions(prev =>
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    }
  };

  // Generation Logic
  const handleGenerate = async () => {
    setError(null);
    if (selectedIngredients.length === 0) {
      setError("食材を1つ以上選んでください。");
      return;
    }

    const prompt = buildPrompt(selectedIngredients, selectedConditions);

    if (!apiKey) {
      // No API Key -> Show prompt
      const result = { content: prompt, type: 'prompt' as const };
      setCurrentResult(result);
      addHistory(prompt, 'prompt');
      return;
    }

    // Has API Key -> Generate
    setIsGenerating(true);
    try {
      const recipe = await generateRecipe(apiKey, prompt);
      const result = { content: recipe, type: 'recipe' as const };
      setCurrentResult(result);
      addHistory(recipe, 'recipe');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setCurrentResult({ content: item.content, type: item.type });
    // Scroll to top or result area ideally
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20 px-4 max-w-4xl mx-auto">
      <Header apiKey={apiKey} setApiKey={setApiKey} />

      <main className="space-y-8">
        {/* Ingredients */}
        <Section
          title="食材を選ぶ"
          onAddItem={addIngredient}
          isDeleteMode={isDeleteModeIngredients}
          setIsDeleteMode={setIsDeleteModeIngredients}
          placeholder="例: トマト"
        >
          {ingredients.map(item => (
            <Chip
              key={item}
              label={item}
              isActive={selectedIngredients.includes(item)}
              onClick={() => toggleIngredient(item)}
              onDelete={() => removeIngredient(item)}
              isDeleteMode={isDeleteModeIngredients}
            />
          ))}
          {ingredients.length === 0 && <p className="text-gray-400 text-sm">食材を追加してください。</p>}
        </Section>

        {/* Conditions */}
        <Section
          title="条件・気分"
          onAddItem={addCondition}
          isDeleteMode={isDeleteModeConditions}
          setIsDeleteMode={setIsDeleteModeConditions}
          placeholder="例: 辛いものが食べたい"
        >
          {conditions.map(item => (
            <Chip
              key={item}
              label={item}
              isActive={selectedConditions.includes(item)}
              onClick={() => toggleCondition(item)}
              onDelete={() => removeCondition(item)}
              isDeleteMode={isDeleteModeConditions}
            />
          ))}
        </Section>

        {/* Action */}
        <div className="flex flex-col items-center gap-4 py-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`
              relative group overflow-hidden px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95
              ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-gentle-orange to-orange-400 hover:shadow-orange-200'}
            `}
          >
            <span className="flex items-center gap-2">
              {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {isGenerating ? "考え中..." : "レシピを考える"}
            </span>
          </button>

          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm animate-in fade-in">
              {error}
            </div>
          )}
        </div>

        {/* Result Area */}
        {currentResult && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="mb-2 text-sm text-gray-400 font-bold ml-2">
              {currentResult.type === 'recipe' ? '🎉 提案レシピ' : '📝 生成されたプロンプト (APIキー未設定)'}
            </div>
            <RecipeCard content={currentResult.content} />
          </div>
        )}

        {/* History Area */}
        {history.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200/50">
            <h2 className="text-xl font-bold text-gray-600 mb-6 flex items-center gap-2">
              <HistoryIcon size={20} /> 履歴
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map(item => (
                <div
                  key={item.id}
                  onClick={() => loadHistoryItem(item)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'recipe' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {item.type === 'recipe' ? 'レシピ' : 'プロンプト'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.timestamp).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 group-hover:text-gentle-orange transition-colors">
                    {item.content}
                  </p>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHistory(item.id);
                      }}
                      className="text-gray-300 hover:text-red-400 text-xs px-2 py-1"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
