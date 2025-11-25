// Make sure to include these imports:
import { GoogleGenerativeAI } from "@google/generative-ai";
export async function GET(request:Request){
    try {
        const genAI = new GoogleGenerativeAI(process.env.GenAI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const prompt = "Create a one unique open-ended and engaging questions formatted as a single string which should not be repeated. These question is for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. The questions should be professional for a social messaging platform. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?. Ensure the question is intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment";
        const result =await model.generateContent(prompt);
        return new Response(result.response.text())
    } catch (error) {
        console.error("Error ocured in suggest messages",error)
    }
}