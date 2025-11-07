import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { title, description, keywords } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a YouTube search query generator.
      Create an effective English search query for finding educational videos related to:
      Course Title: "${title}"
      Description: "${description}"
      Keywords: ${keywords}
      The query should be concise and optimized for YouTube search.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      result: text.trim() || "Could not generate query",
    });
  } catch (error) {
    console.error("Error generating YouTube query:", error);
    return NextResponse.json(
      { error: "فشل إنشاء استعلام يوتيوب" },
      { status: 500 }
    );
  }
}
