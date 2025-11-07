import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust path as needed
import { courseSchema } from "@/app/validations/course-schema";
type Params = Promise<{
  course_id: string;
}>;
export async function GET(request: Request, data: { params: Params }) {
  const params = await data.params;
  const course_id = params.course_id;
  try {
    const course = await prisma.course.findUnique({
      where: { id: course_id },
      select: {
        id: true,
        title: true,
        description: true,
        field: true,
        level: true,
        targetAudience: true,
        duration: true,
        goals: true,
        keywords: true,
        imagePrompt: true,
        createdAt: true,
        updatedAt: true,
        youtubeQuery: true,
        generatedImage: true,
        generatedContent:true,
        lessons: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, data: { params: Params }) {
  const params = await data.params;
  const course_id = params.course_id;

  try {
    const body = await request.json();
    const validation = courseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: course_id },
      data: validation.data,
    });

    return NextResponse.json(updatedCourse);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, data: { params: Params }) {
  const params = await data.params;
  const course_id = params.course_id;
  try {
    await prisma.course.delete({
      where: { id: course_id },
    });
    return NextResponse.json({ message: "Course deleted" }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting course" },
      { status: 500 }
    );
  }
}
