/**
 * Constructs a prompt for the AI based on selected ingredients and conditions.
 */
export const buildPrompt = (
    ingredients: string[],
    conditions: string[]
): string => {
    if (ingredients.length === 0) {
        return "食材が選択されていません。何か食材を選んでください。";
    }

    const ingredientList = ingredients.join("、");
    const conditionList = conditions.length > 0
        ? conditions.map((c) => `- ${c}`).join("\n")
        : "特になし";

    return `
あなたはプロの料理研究家です。以下の食材と条件に基づいて、家庭で簡単に作れる美味しいレシピを1つ提案してください。

## 使用する食材
${ingredientList}

## 条件・要望
${conditionList}

## 出力形式
Markdown形式で出力してください。以下の構成を含めてください：
1. **料理名**: 魅力的な名前をつけてください。
2. **予想調理時間**: おおよその時間。
3. **材料リスト**: 分量も記載（2人分）。見やすくするために表形式（Markdownのテーブル）で出力してください。
4. **作り方**: ステップバイステップで分かりやすく。
5. **ワンポイントアドバイス**: 美味しくするコツやアレンジ方法。

雰囲気は「優しく」「丁寧」にお願いします。
  `.trim();
};
