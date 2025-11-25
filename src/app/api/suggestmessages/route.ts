import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// CRITICAL: Forces the API to run dynamically on every request (prevents caching)
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const apiKey = process.env.GenAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { message: "Gemini API Key is missing in environment variables" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Create a single, engaging, open-ended question for an anonymous messaging platform (like Qooh.me). 
    The question should be suitable for a diverse audience, professional yet friendly. 
    Avoid sensitive, political, or overly personal topics. 
    Focus on hobbies, dreams, favorites, or hypothetical scenarios.
    Output ONLY the question string. Do not include labels like "Question:" or quotes.
    Example: What is a skill you have always wanted to learn?`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Return a JSON object so the frontend can parse "response.data.message"
    return NextResponse.json({ message: text }, { status: 200 });

  } catch (error) {
    console.error("Error generating suggestion:", error);
    return NextResponse.json(
      { message: "Failed to generate suggestion. Please try again." },
      { status: 500 }
    );
  }
}