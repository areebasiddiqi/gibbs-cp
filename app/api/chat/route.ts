import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are a helpful assistant for a website dedicated to Gibbs' Reflective Cycle. 
Your goal is to help nursing professionals and students understand and apply the 6 phases of Gibbs' Reflective Cycle:
1. Description: What happened?
2. Feelings: What were you thinking and feeling?
3. Evaluation: What was good and bad about the experience?
4. Analysis: What sense can you make of the situation?
5. Conclusion: What else could you have done?
6. Action Plan: If it rose again, what would you do?

Be professional, empathetic, and encouraging. Provide clear explanations and examples when asked. 
If a user asks about something unrelated to Gibbs' Reflective Cycle or nursing mentorship, politely steer the conversation back to these topics.`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API key is not configured" },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Format messages for Gemini
        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to help users with Gibbs' Reflective Cycle." }],
                },
                ...history,
            ],
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ content: text });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
