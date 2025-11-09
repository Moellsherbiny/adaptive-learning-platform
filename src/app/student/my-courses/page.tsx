import { redirect } from "next/navigation";
import { getUserData } from "@/lib/getUserData";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/cloudinary";
import Markdown from "react-markdown";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button";
import { FolderOpen, BookOpen, User, ArrowLeft, GraduationCap } from "lucide-react";

export default async function MyCoursesPage() {
  const user = await getUserData();

  if (!user || "error" in user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            حدث خطأ أثناء تحميل بيانات المستخدم
          </p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              دوراتي
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mr-14">
            الدورات التي قمت بالتسجيل فيها ({enrollments.length})
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {enrollments.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderOpen className="w-16 h-16" />
                </EmptyMedia>
                <EmptyTitle className="text-2xl font-bold mt-4">
                  لا توجد دورات تعليمية متاحة
                </EmptyTitle>
                <EmptyDescription className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">
                  عزيزي الطالب، لم تقم بعد بالاشتراك في أي دورة تعليمية. ابدأ رحلتك التعليمية الآن!
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="mt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/student/courses" className="flex items-center gap-2">
                      <span>مشاهدة الدورات المتاحة</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">
                      العودة للوحة الرئيسية
                    </Link>
                  </Button>
                </div>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map(({ course }) => (
              <div
                key={course.id}
                className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Course Image */}
                <Link href={`/student/my-courses/${course.id}`}>
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600">
                    <Image
                      src={getImageUrl(course.generatedImage || "") || "/default-course.png"}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      width={400}
                      height={192}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Enrolled Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        <GraduationCap className="w-3 h-3" />
                        <span>مسجل</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Course Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <Link href={`/student/my-courses/${course.id}`}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {course.title}
                    </h2>

                    <div className="prose prose-sm dark:prose-invert mb-4 line-clamp-3 text-gray-600 dark:text-gray-400">
                      <Markdown>
                        {course.description.length > 120
                          ? course.description.slice(0, 120) + "..."
                          : course.description}
                      </Markdown>
                    </div>

                    {/* Teacher Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span>المعلم: {course.teacher?.name || "غير معروف"}</span>
                    </div>
                  </Link>

                  {/* Action Button */}
                  <Link
                    href={`/student/my-courses/${course.id}`}
                    className="mt-auto w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  >
                    <span>مشاهدة الدورة</span>
                    <ArrowLeft className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}