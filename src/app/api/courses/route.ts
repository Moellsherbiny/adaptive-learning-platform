import { getUserData } from "@/lib/getUserData";
import prisma from "@/lib/prisma"; // assuming you have Prisma set up
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET() {
  try {
    const user = await getUserData();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const teacherId = user.id;
    if (!teacherId) {
      return NextResponse.json({ error: "Missing teacherId" }, { status: 400 });
    }
    const courses = await prisma.course.findMany({ where: { teacherId } });
    return NextResponse.json(courses);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching courses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const {
    title,
    description,
    field,
    targetAudience,
    level,
    duration,
    goals,
    keywords,
  } = await req.json();
  const user = await getUserData();

  if (!title || !description || !field) {
    return NextResponse.json(
      { message: "please this fields is required" },
      { status: 204 }
    );
  }

  const teacherId = user.id;
  if (!teacherId || user.role !== "teacher")
    return NextResponse.json(
      { message: "you are unauthorized" },
      { status: 401 }
    );
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const prompt = `
      أنت مساعد لإنشاء محتوي لدورات تعليمية. 
      أُنشئ محتويً تفصيليًا باللغة العربية لدورة بعنوان "${title}" في مجال "${field}".
      يجب أن يكون المحتوي جذابًا ويوضح فوائد الدورة وما سيتعلمه الطلاب.
      أضف فواصل واضحة بين الفقرات.
      [
        {
          "title": "عنوان الفقرة",
          "content": "محتوي الفقرة"
        },
        ...
        ]
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  await prisma.course.create({
    data: {
      teacherId,
      title,
      description,
      field,
      targetAudience,
      level,
      duration,
      goals,
      keywords,
      generatedContent: JSON.parse(text),
    },
  });

  return NextResponse.json(
    {
      message: "course created successfully",
      data: {
        teacherId,
        title,
        description,
        field,
        targetAudience,
        level,
        duration,
        goals,
        keywords,
      },
    },
    { status: 201 }
  );
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query: string | null = await searchParams.get("course");
  if (!query) {
    return NextResponse.json({ message: "Access Denied" });
  }
  await prisma.course.delete({
    where: {
      id: query,
    },
  });

  return NextResponse.json({ message: "course deleted succ" });
}
