import { redirect } from "next/navigation";
import { getUserData } from "@/lib/getUserData";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/cloudinary";
import Markdown from "react-markdown";

export default async function MyCoursesPage() {
  // جلب بيانات المستخدم
  const user = await getUserData();

  // التحقق من وجود المستخدم
  if (!user || "error" in user) return <div>⚠️ حدث خطأ أثناء تحميل بيانات المستخدم</div>;

  // إعادة توجيه المستخدم إذا لم يكن طالبًا
  if (user.role !== "student") {
    redirect("/teacher/courses");
  }

  // جلب الدورات المسجل فيها الطالب
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: user.id },
    include: { course: { include: { teacher: true } } },
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 دوراتي</h1>
      {enrollments.length === 0 ? (
        <p className="text-center text-gray-600">لم تقم بالتسجيل في أي دورة بعد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(({ course }) => (
            <div key={course.id} className="border p-4 rounded-lg shadow-md  flex flex-col text-right">

              <Image
                src={getImageUrl(course.generatedImage || "") || "/default-course.png"}
                alt={course.title}
                className="w-full h-40 object-cover rounded mb-3"
                width={300}
                height={160}
                priority
              />


              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <Markdown>{course.description.length > 100 ? course.description.slice(0, 100) + "..." : course.description}</Markdown>
              <p className="text-sm text-gray-500 mb-2">
                المُعلم: {course.teacher?.name || "غير معروف"}
              </p>


              <Link
                href={`/student/my-courses/${course.id}`}
                className="mt-auto bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                مشاهدة الدورة
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
