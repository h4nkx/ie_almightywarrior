
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";

export class InterviewService {
  /**
   * Recreates the GoogleGenAI instance on every call to ensure the most current 
   * API key from the aistudio dialog is used, as mandated by the guidelines.
   * We use 'gemini-3-pro-preview' for the complex reasoning required in IE interviews.
   */
  async *sendMessageStream(message: string, history: Message[]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Map internal message roles ('candidate', 'interviewer') to Gemini roles ('user', 'model').
    const chatHistory = history.map(m => ({
      role: m.role === 'candidate' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.content }]
    }));

    try {
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.8,
          topP: 0.95,
          thinkingConfig: { thinkingBudget: 4000 }
        },
        history: chatHistory,
      });

      const stream = await chat.sendMessageStream({ message });
      for await (const chunk of stream) {
        const text = (chunk as GenerateContentResponse).text;
        if (text) {
          yield text;
        }
      }
    } catch (error: any) {
      console.error("Gemini Stream Error:", error);
      // Reset key signal if requested entity not found error occurs.
      if (error?.message?.includes("Requested entity was not found")) {
        yield "ERROR_KEY_NOT_FOUND";
      } else {
        yield "（信号中断）面试官正在整理思绪，请稍后再试。";
      }
    }
  }
}

export const interviewService = new InterviewService();
