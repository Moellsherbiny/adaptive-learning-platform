import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany();
  return NextResponse.json({ data: testimonials });
}

export async function POST(req: Request) {
  const { name, content, rating, avatar, university } = await req.json();

  if (!name || !content || !rating ) {
    return NextResponse.json(
      { message: "Please fill all required fields" },
      { status: 400 }
    );
  }

  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return NextResponse.json(
      { message: "Rating must be a number between 1 and 5" },
      { status: 400 }
    );
  }

  try {
    const existingTestimonial = await prisma.testimonial.findFirst({
      where: {
        name,
      },
    });

    if (existingTestimonial) {
      return NextResponse.json(
        { message: "Testimonial already exists" },
        { status: 400 }
      );
    }

    await prisma.testimonial.create({
      data: {
        name,
        content,
        rating: numericRating,
        avatar,
        university,
      },
    });
    return NextResponse.json({ message: "Testimonial created successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  await prisma.testimonial.deleteMany();
  return NextResponse.json({ message: "All testimonials deleted successfully" }, { status: 200 });
}

