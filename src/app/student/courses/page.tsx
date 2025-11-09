import { redirect } from "next/navigation";
import { getUserData } from "@/lib/getUserData";
import prisma from "@/lib/prisma";
import EnrollButton from "@/components/EnrollButton";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/cloudinary";
import Markdown from "react-markdown";
import { BookOpen, User, ArrowLeft } from "lucide-react";

export default async function StudentCoursesPage() {
  const user = await getUserData();
  if (user.error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-red-600 dark:text-red-400">
            حدث خطأ أثناء تحميل بيانات المستخدم
          </p>
        </div>
      </div>
    );
  }

  if (user.role !== "student" && user.role !== "teacher") {
    redirect("/teacher/courses");
  }

  const courses = await prisma.course.findMany({
    include: { teacher: true },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              الدورات المتاحة
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mr-14">
            استكشف واختر الدورة المناسبة لك
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              لا توجد دورات متاحة حالياً
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Course Image */}
                <Link href={`/student/courses/${course.id}`}>
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                    <Image
                      src={
                        getImageUrl(course.generatedImage || "") ||
                        "/default-course.png"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      width={400}
                      height={192}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>

                {/* Course Content */}
                <div className="p-5">
                  <Link href={`/student/courses/${course.id}`}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span>{course.teacher?.name || "غير معروف"}</span>
                    </div>
                  </Link>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <EnrollButton courseId={course.id} studentId={user.id} />
                    </div>
                    <Link
                      href={`/student/courses/${course.id}`}
                      className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <span>عرض</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}