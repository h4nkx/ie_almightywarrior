
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";

export class InterviewService {
  private getAI() {
    // 直接使用环境注入的 API_KEY，无需用户手动配置
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async *sendMessageStream(message: string, history: Message[]) {
    const ai = this.getAI();
    
    const chatHistory = history.map(m => ({
      role: m.role === 'candidate' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.content }]
    }));

    try {
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.75,
          topP: 0.9,
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
      yield "（信号微弱）面试官正在审视你的逻辑，请再次尝试表述。";
    }
  }
}

export const interviewService = new InterviewService();
