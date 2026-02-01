/**
 * Calls the Gemini API to generate content.
 */
export const generateRecipe = async (apiKey: string, prompt: string): Promise<string> => {
    if (!apiKey) {
        throw new Error("APIキーが設定されていません。");
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Gemini API Error:", errorData);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            throw new Error("レシピの生成に失敗しました（空の応答）。");
        }

        return generatedText;
    } catch (error) {
        console.error("Recipe generation failed:", error);
        throw error;
    }
};
