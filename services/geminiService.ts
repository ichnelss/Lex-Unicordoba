
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { ChatMessage } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getChatbotResponseStream = async (history: ChatMessage[], newMessage: string) => {
    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history
    });
    const result = await chat.sendMessageStream({ message: newMessage });
    return result;
};


export const summarizeChange = async (baseNormText: string, modifyingNormText: string): Promise<string> => {
    const prompt = `
      Eres un asistente legal experto en análisis normativo. A continuación se presenta el texto de una norma base y el texto de una norma que la modifica. 
      Tu tarea es generar un resumen conciso y preciso de los cambios introducidos por la norma modificatoria.
      
      NORMA BASE:
      ---
      ${baseNormText}
      ---
      
      NORMA MODIFICATORIA:
      ---
      ${modifyingNormText}
      ---
      
      Por favor, proporciona un resumen claro de las modificaciones.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing change with Gemini:", error);
        return "No se pudo generar el resumen.";
    }
};

export const performGroundedSearch = async (query: string): Promise<{ text: string, sources: any[] }> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: query,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        const text = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { text, sources };
    } catch (error) {
        console.error("Error with grounded search:", error);
        return { text: "Ocurrió un error al realizar la búsqueda.", sources: [] };
    }
};
