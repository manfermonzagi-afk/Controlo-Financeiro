
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AIInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialInsights = async (transactions: Transaction[]): Promise<AIInsight> => {
  const transactionsContext = transactions.map(t => 
    `${t.type === 'income' ? '+' : '-'}${t.amount} em ${t.date.split('T')[0]} - ${t.description} (${t.category})`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise as seguintes transações financeiras e forneça um insight útil para o usuário economizar ou gerenciar melhor o dinheiro:\n\n${transactionsContext}`,
      config: {
        systemInstruction: "Você é um consultor financeiro pessoal experiente e amigável. Analise os dados fornecidos e retorne um JSON com os campos: title, message, suggestion e priority ('low', 'medium', 'high'). Responda em Português do Brasil.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            message: { type: Type.STRING },
            suggestion: { type: Type.STRING },
            priority: { type: Type.STRING }
          },
          required: ["title", "message", "suggestion", "priority"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as AIInsight;
  } catch (error) {
    console.error("Erro ao obter insights do Gemini:", error);
    return {
      title: "Conselho Geral",
      message: "Mantenha o registro de todos os seus gastos para uma análise mais precisa.",
      suggestion: "Tente reduzir gastos não essenciais neste mês.",
      priority: "low"
    };
  }
};

export const parseNaturalLanguageTransaction = async (input: string): Promise<Partial<Transaction> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extraia os detalhes da transação desta frase: "${input}"`,
      config: {
        systemInstruction: "Extraia o valor (number), descrição (string), tipo ('income' ou 'expense') e categoria sugerida com base em: Alimentação, Moradia, Transporte, Saúde, Educação, Lazer, Trabalho, Outros. Responda em JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            description: { type: Type.STRING },
            type: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["amount", "description", "type", "category"]
        }
      }
    });

    return JSON.parse(response.text || 'null');
  } catch (error) {
    console.error("Erro ao interpretar linguagem natural:", error);
    return null;
  }
};
