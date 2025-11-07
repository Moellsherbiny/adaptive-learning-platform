import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function POST(request: Request) {
  const { teacherId, studentId, feedback } = await request.json();
  if (!studentId || !teacherId || !feedback) {
    return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
  }

  await prisma.feedback.create({
    data: {
      studentId,
      teacherId, // Replace with actual teacher value
      feedback,
    },
  
  });
  return NextResponse.json({ message: "تم إرسال الملاحظات بنجاح" }, { status: 200 });
}
