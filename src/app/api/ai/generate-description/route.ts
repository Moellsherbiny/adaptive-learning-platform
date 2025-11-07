import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { title, field } = await request.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      أنت مساعد لإنشاء وصف لدورات تعليمية. 
      أُنشئ وصفًا تفصيليًا باللغة العربية لدورة بعنوان "${title}" في مجال "${field}".
      يجب أن يكون الوصف جذابًا ويوضح فوائد الدورة وما سيتعلمه الطلاب.
      أضف فواصل واضحة بين الفقرات.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      result: text || "لا يمكن توليد الوصف حالياً",
    });
  } catch (error) {
    console.error("Error generating description:", error);
    return NextResponse.json({ error: "فشل إنشاء الوصف" }, { status: 500 });
  }
}
