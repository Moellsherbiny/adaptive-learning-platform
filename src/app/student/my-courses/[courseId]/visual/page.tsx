'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ListVideo, 
  MonitorPlay, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Menu, 
  X, 
  PlayCircle,
  BookOpen,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'
import Image from 'next/image'
import { axiosInstance } from '@/lib/axiosInstance'
import { toast } from 'sonner'
import pic from "@/assets/pic.jpeg"
import pic2 from "@/assets/pic2.jpeg"

type Lesson = {
  videoId: string
  title: string
  description: string
  thumbnail: string
}

interface Content {
  title: string;
  content: string
}

type Course = {
  id: string
  title: string
  description: string
  field: string
  level?: string | null
  generatedImage?: string | null
  generatedContent?: Content[] | null
  lessons?: Lesson[] | string
}

export default function CourseStudyPage() {
  const router = useRouter()
  const { courseId } = useParams<{ courseId: string }>()
  const [activeLessonIndex, setActiveLessonIndex] = useState(0)
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const { data } = await axiosInstance.get(`/courses/${courseId}`)
        setCourse(data)

        const parsedLessons = typeof data.lessons === 'string' ?
          JSON.parse(data.lessons) :
          Array.isArray(data.lessons) ? data.lessons : []

        setLessons(parsedLessons)
      } catch (error) {
        console.error('Error fetching course:', error)
        toast.error('حدث خطأ أثناء تحميل الدورة')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  const currentLesson = lessons[activeLessonIndex]

  const handleNextLesson = () => {
    if (activeLessonIndex < lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1)
    }
  }

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950" dir="rtl">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">جاري تحميل الدورة...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">لم يتم العثور على الدورة</p>
          <Button 
            onClick={() => router.push('/student/courses')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            العودة إلى قائمة الدورات
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950" dir="rtl">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/student/courses/${courseId}`)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {course.field} • {course.level || 'غير محدد'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                الدرس {activeLessonIndex + 1} من {lessons.length}
              </Badge>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Video Player Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
              {/* Video Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <PlayCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {currentLesson?.title || 'لا يوجد عنوان'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      الدرس {activeLessonIndex + 1}
                    </p>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                {currentLesson ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${currentLesson.videoId}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white">
                    <MonitorPlay className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg">لا يوجد درس متاح</p>
                  </div>
                )}
              </div>

              {/* Video Controls */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between gap-4">
                  <Button
                    onClick={handlePrevLesson}
                    disabled={activeLessonIndex === 0 || lessons.length === 0}
                    className="flex-1 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                  >
                    <ChevronRight className="w-4 h-4 ml-2" />
                    الدرس السابق
                  </Button>
                  <Button
                    onClick={handleNextLesson}
                    disabled={activeLessonIndex === lessons.length - 1 || lessons.length === 0}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    الدرس التالي
                    <ChevronLeft className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Additional Learning Materials */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  مواد تعليمية إضافية
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                إليك أدوات التصميم، إذا كنت تفضل التعلم عن طريق الصور
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                  <Image 
                    src={pic} 
                    height={600} 
                    width={600} 
                    alt='explain tools'
                    className="w-full h-auto"
                  />
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                  <Image 
                    src={pic2} 
                    height={600} 
                    width={600} 
                    alt='explain tools'
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Lessons List */}
          <div className={`
            lg:w-96 
            fixed lg:static inset-0 z-40 
            bg-white dark:bg-gray-900 lg:bg-transparent
            transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0
            transition-transform duration-300 ease-in-out
            overflow-y-auto lg:overflow-visible
            p-4 lg:p-0
          `}>
            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden absolute top-4 left-4 z-50"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Lessons List Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg mt-12 lg:mt-0">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="flex items-center justify-between text-white">
                  <h3 className="font-bold text-lg">دروس الدورة</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <ListVideo className="h-4 w-4" />
                    <span>{lessons.length} دروس</span>
                  </div>
                </div>
              </div>

              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {lessons.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {lessons.map((lesson, index) => (
                      <div
                        key={lesson.videoId}
                        onClick={() => {
                          setActiveLessonIndex(index)
                          setSidebarOpen(false)
                        }}
                        className={`
                          flex items-center gap-3 p-4 cursor-pointer transition-all
                          ${activeLessonIndex === index 
                            ? 'bg-blue-50 dark:bg-blue-950/30 border-r-4 border-blue-600' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }
                        `}
                      >
                        <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                          <Image
                            src={lesson.thumbnail}
                            alt={lesson.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            {activeLessonIndex === index ? (
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <PlayCircle className="h-5 w-5 text-white" />
                              </div>
                            ) : (
                              <PlayCircle className="h-6 w-6 text-white opacity-80" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`
                              text-xs font-bold px-2 py-0.5 rounded-full
                              ${activeLessonIndex === index 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }
                            `}>
                              {index + 1}
                            </span>
                            {activeLessonIndex > index && (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <h4 className={`
                            font-medium text-sm truncate
                            ${activeLessonIndex === index 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-900 dark:text-white'
                            }
                          `}>
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {lesson.description.substring(0, 50)}...
                          </p>
                        </div>

                        {activeLessonIndex === index && (
                          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                    <ListVideo className="h-12 w-12 mb-3 opacity-30" />
                    <p>لا توجد دروس متاحة</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}