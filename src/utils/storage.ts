import { useState, useEffect } from 'react';

// --- Default Data ---
export const DEFAULT_INGREDIENTS = [
    "鶏肉", "豚肉", "玉ねぎ", "キャベツ", "卵", "豆腐", "じゃがいも"
];

export const DEFAULT_CONDITIONS = [
    "追加食材はスーパーで買えるコスパが良いもののみ",
    "作り置き用に複数のレシピを提案して",
    "手軽に15分以内で作れるもの",
    "2歳の子供がお手伝いできる部分があるレシピ",
    "日本酒に合うおつまみ"
];

// --- Hooks ---

/**
 * Hook for API Key managed in Session Storage.
 * Security: Cleared when the tab is closed.
 */
export const useApiKey = () => {
    const [apiKey, setApiKey] = useState<string>(() => {
        return sessionStorage.getItem('gemini_api_key') || '';
    });

    useEffect(() => {
        if (apiKey) {
            sessionStorage.setItem('gemini_api_key', apiKey);
        } else {
            sessionStorage.removeItem('gemini_api_key');
        }
    }, [apiKey]);

    return [apiKey, setApiKey] as const;
};

/**
 * Generic hook for managing a list of strings in Local Storage.
 * Convenience: Persists across sessions.
 */
export const useLocalStorageList = (key: string, defaultList: string[]) => {
    const [list, setList] = useState<string[]>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultList;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return defaultList;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(list));
        } catch (error) {
            console.warn(`Error writing localStorage key "${key}":`, error);
        }
    }, [key, list]);

    const addItem = (item: string) => {
        if (!item.trim() || list.includes(item)) return;
        setList([...list, item]);
    };

    const removeItem = (item: string) => {
        setList(list.filter((i) => i !== item));
    };

    return { list, addItem, removeItem, setList };
};

// --- History Hook ---
export interface HistoryItem {
    id: string;
    timestamp: number;
    content: string;
    type: 'recipe' | 'prompt';
}

export const useHistory = () => {
    const [history, setHistory] = useState<HistoryItem[]>(() => {
        try {
            const item = localStorage.getItem('recipe_history');
            return item ? JSON.parse(item) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('recipe_history', JSON.stringify(history));
    }, [history]);

    const addHistory = (content: string, type: 'recipe' | 'prompt') => {
        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            content,
            type
        };
        setHistory([newItem, ...history]);
    };

    const removeHistory = (id: string) => {
        setHistory(history.filter(h => h.id !== id));
    };

    const clearHistory = () => setHistory([]);

    return { history, addHistory, removeHistory, clearHistory };
};
