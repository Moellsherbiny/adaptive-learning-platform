import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { title, field } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      أنت مساعد لإنشاء أهداف تعليمية للدورات.
      أُنشئ 5 أهداف تعليمية باللغة العربية لدورة بعنوان "${title}" في مجال "${field}".
      يجب أن تكون الأهداف واضحة وقابلة للقياس.
      قدم النتائج كنقاط مرقمة.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      result: text || "لا يمكن توليد الأهداف حالياً",
    });
  } catch (error) {
    console.error("Error generating goals:", error);
    return NextResponse.json(
      { error: "فشل إنشاء الأهداف التعليمية" },
      { status: 500 }
    );
  }
}
