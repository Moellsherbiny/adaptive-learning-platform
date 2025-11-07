'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ListVideo, MonitorPlay, ChevronRight, ChevronLeft, Loader2, Menu, X } from 'lucide-react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false) // State for sidebar visibility

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
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container py-8 text-center" dir="rtl">
        <p>لم يتم العثور على الدورة</p>
        <Button variant="link" onClick={() => router.push('/student/courses')}>
          العودة إلى قائمة الدورات
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-6 relative" dir="rtl">
      {/* Mobile Sidebar Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden fixed bottom-4 left-4 z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content - Video Player */}
        <div className="lg:flex-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  الدرس {activeLessonIndex + 1}: {currentLesson?.title || 'لا يوجد عنوان'}
                </CardTitle>
                <Badge variant="secondary" className="text-sm">
                  {activeLessonIndex + 1}/{lessons.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Player */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {currentLesson ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${currentLesson.videoId}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                    <MonitorPlay className="h-12 w-12" />
                    <p className="mt-2">لا يوجد درس متاح</p>
                  </div>
                )}
              </div>

              {/* Video Navigation */}
              <div className="flex justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevLesson}
                  disabled={activeLessonIndex === 0 || lessons.length === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronRight className="h-4 w-4" />
                  الدرس السابق
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNextLesson}
                  disabled={activeLessonIndex === lessons.length - 1 || lessons.length === 0}
                  className="flex items-center gap-2"
                >
                  الدرس التالي
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
                <br />
               <h1>إليك أدوات التصميم ، إذا كنت تفضل التعلم عن طريق الصور </h1>
                <Image src={pic} height={600} width={600} alt='explain tools' />
                <Image src={pic2} height={600} width={600} alt='explain tools' />
              {/* Lesson Description
        {content?.map((section: Content, index: number) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-right"> {index + 1} - {section.title}</h2>
          <p className="text-right text-gray-700 whitespace-pre-line">{section.content}</p>
        </div>
      ))} */}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Course Info and Lessons List */}
        <div className={`
          lg:w-80 space-y-6
          fixed lg:static inset-0 z-40 bg-background p-4 lg:p-0
          transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0
          transition-transform duration-300 ease-in-out
          overflow-y-auto
        `}>
          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden absolute top-2 left-2"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Course Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الدورة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image
                    src={course.generatedImage ?
                      `https://res.cloudinary.com/dzk9wr2p6/image/upload/${course.generatedImage}` :
                      "/default-course.png"}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {course.field} • {course.level || 'غير محدد'}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/student/courses/${courseId}`)}
              >
                العودة إلى صفحة الدورة
              </Button>
            </CardContent>
          </Card>

          {/* Lessons List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>دروس الدورة</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ListVideo className="h-4 w-4" />
                  <span>{lessons.length} دروس</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {lessons.length > 0 ? (
                  lessons.map((lesson, index) => (
                    <div
                      key={lesson.videoId}
                      onClick={() => {
                        setActiveLessonIndex(index)
                        setSidebarOpen(false) // Close sidebar on mobile when lesson is selected
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${activeLessonIndex === index ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'}`}
                    >
                      <div className="relative w-16 h-10 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={lesson.thumbnail}
                          alt={lesson.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <MonitorPlay className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          الدرس {index + 1}: {lesson.title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {lesson.description.substring(0, 50)}...
                        </p>
                      </div>
                      {activeLessonIndex === index && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>لا توجد دروس متاحة</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}