
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { interactions } = body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `User interacted with the following content types: ${interactions.join(', ')}.
      Determine the user's favorite type and give a score out of 100 for each type.
      Respond one word (audio, written or visual) only
      }`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    return NextResponse.json(text);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
