import AudioParagraphs from '@/components/audioParagraphs';
import prisma from "@/lib/prisma"
import { Headphones, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
    params: Promise<{ courseId?: string }>
}

export default async function AudioCoursePage({ params }: Props) {
    const { courseId } = await params
    
    const courseContent = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            teacher: {
                select: {
                    name: true
                }
            }
        }
    })

    if (!courseContent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center" dir="rtl">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                        لم يتم العثور على محتوى الدورة
                    </p>
                    <Link href="/student/courses">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            العودة إلى الدورات
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950" dir="rtl">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <Link 
                        href={`/student/my-courses/${courseId}`}
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
                    >
                        <ArrowRight className="w-4 h-4" />
                        <span className="text-sm font-medium">العودة إلى الدورة</span>
                    </Link>

                    {/* Course Header */}
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                            <Headphones className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                                    محتوى صوتي
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {courseContent.title}
                            </h1>
                            {courseContent.description && (
                                <p className="text-gray-600 dark:text-gray-400 mb-3 max-w-3xl">
                                    {courseContent.description}
                                </p>
                            )}
                            {courseContent.teacher && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">
                                            {courseContent.teacher.name && courseContent.teacher.name.charAt(0).toUpperCase() || ''}
                                        </span>
                                    </div>
                                    <span>المعلم: {courseContent.teacher.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Audio Content Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {courseContent.generatedContent ? (
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
                        {/* Content Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm">
                                    <Headphones className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        استمع إلى محتوى الدورة
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        يمكنك الاستماع لكل فقرة على حدة
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Audio Paragraphs Component */}
                        <div className="p-6">
                            <AudioParagraphs units={courseContent.generatedContent} />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg p-12">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Headphones className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                لا يوجد محتوى صوتي متاح
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                لم يتم إضافة محتوى صوتي لهذه الدورة بعد
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Headphones className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                نصائح للتعلم الصوتي
                            </h3>
                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                                    <span>استخدم سماعات الأذن للحصول على أفضل تجربة استماع</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                                    <span>يمكنك الاستماع أثناء التنقل أو ممارسة الأنشطة الأخرى</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                                    <span>كرر الاستماع للفقرات المهمة لتحسين الاستيعاب</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}