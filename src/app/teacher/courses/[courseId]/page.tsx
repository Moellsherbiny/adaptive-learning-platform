'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Edit, Users, BookOpen, BarChart, FileText, Video, ImageIcon, Download } from 'lucide-react'
import { axiosInstance } from '@/lib/axiosInstance'
import { toast } from 'sonner'
import defaultImg from '@/assets/course-default.png'
import Image from 'next/image'
import Markdown from 'react-markdown'


type Material = {
  id: string
  name: string
  url: string
  type: string
}

type Lesson = {
  thumbnail: string
  id: string
  videoId: string
  title: string
  description?: string | null
  order: number
  videoUrl?: string | null
  materials?: Material[]
}

type Question = {
  id: string
  text: string
  options: string[]
  correctAnswer: number
}

type Quiz = {
  id: string
  title: string
  questions?: Question[]
}

type Enrollment = {
  id: string
  student: {
    id: string
    name: string
    email: string
    image?: string | null
  }
  enrolledAt: string
  progress: number
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
  targetAudience?: string | null
  duration?: string | null
  goals?: string | null
  keywords?: string | null
  imagePrompt?: string | null
  youtubeQuery?: string | null
  generatedImage?: string | null
  generatedContent?: Content[] | null
  createdAt: string
  updatedAt: string
  teacherId: string
  enrollments?: Enrollment[]
  lessons?: Lesson[] | string
  quiz?: Quiz[]
}

export default function CourseViewPage() {
  const router = useRouter()
  const { courseId } = useParams<{ courseId: string }>()

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axiosInstance.get<Course>(`/courses/${courseId}`)
        const parsedLessons = typeof data.lessons === 'string'
          ? JSON.parse(data.lessons) as Lesson[]
          : data.lessons || [];

        setCourse({
          ...data,
          enrollments: data.enrollments || [],
          lessons: parsedLessons,
          quiz: data.quiz || []
        })
      } catch (error) {
        console.error(error)
        toast.error('فشل تحميل الدورة', {
          description: 'الرجاء المحاولة مرة أخرى لاحقًا',
        })
      } finally {
        setLoading(false)
      }
    }

    if (courseId) fetchCourse()
  }, [courseId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const content: Content[] | null | undefined  = course?.generatedContent ;
  console.log(typeof course?.generatedContent);
  if (!course) {
    return (
      <div className="container py-8 text-center" dir="rtl">
        <p>لم يتم العثور على الدورة</p>
        <Button variant="link" onClick={() => router.push('/teacher/courses')}>
          العودة إلى قائمة الدورات
        </Button>
      </div>
    )
  }
  console.log(Array(course.generatedContent))
  // Helper functions to safely handle null/undefined values
  const safeSplit = (str?: string | null, delimiter: string = ',') =>
    str ? str.split(delimiter).filter(Boolean) : []

  const safeGoals = (goals?: string | null) =>
    goals ? goals.split('\n').filter(Boolean) : []

  const sortedLessons = Array.isArray(course.lessons)
    ? [...course.lessons].sort((a, b) => a.order - b.order)
    : []
  console.log(sortedLessons)
  return (
    <div className="container py-8" dir="rtl">
      {/* Header and Edit Button */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">
            {course.field} • {course.level || 'غير محدد'}
          </p>
        </div>
        <Button onClick={() => router.push(`/teacher/courses/${courseId}/edit`)}>
          <Edit className="ml-2 h-4 w-4" />
          تعديل الدورة
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir='rtl'>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BookOpen className="ml-2 h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="ml-2 h-4 w-4" />
            الطلاب ({course.enrollments?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="ml-2 h-4 w-4" />
            المحتوى ({sortedLessons.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="ml-2 h-4 w-4" />
            التحليلات
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-10 md:mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>معلومات الدورة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">الوصف</h3>

                  <Markdown>
                    {course.description || 'لا يوجد وصف'}
                  </Markdown>

                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">المدة</h3>
                    <p className="text-muted-foreground">
                      {course.duration || 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">الفئة المستهدفة</h3>
                    <p className="text-muted-foreground">
                      {course.targetAudience || 'غير محدد'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">الأهداف التعليمية</h3>
                  {safeGoals(course.goals).length > 0 ? (
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {safeGoals(course.goals).map((goal, i) => (
                        <li key={i}>{goal}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">لا توجد أهداف محددة</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium">الكلمات المفتاحية</h3>
                  {safeSplit(course.keywords).length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {safeSplit(course.keywords).map((keyword, i) => (
                        <Badge key={i} variant="outline">
                          {keyword.trim()}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">لا توجد كلمات مفتاحية</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Course Image and YouTube Query */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>صورة الدورة</CardTitle>
                </CardHeader>
                <CardContent>
                  {course.generatedImage ? (
                    <div className="relative">
                      <Image
                        width={300}
                        height={300}
                        src={`https://res.cloudinary.com/dzk9wr2p6/image/upload/${course.generatedImage}` || defaultImg}
                        alt="Course"
                        className="rounded-md w-full h-auto"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 left-2"
                        onClick={() => window.open(`https://res.cloudinary.com/dzk9wr2p6/image/upload/${course.generatedImage}`, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 bg-muted rounded-md">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>استعلام يوتيوب</CardTitle>
                  <CardDescription>للبحث عن فيديوهات ذات صلة</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="p-2 bg-muted rounded-md">
                    {course.youtubeQuery || 'غير محدد'}
                  </p>
                  {course.youtubeQuery && (
                    <Button
                      variant="link"
                      className="mt-2 p-0"
                      onClick={() => window.open(
                        `https://youtube.com/results?search_query=${encodeURIComponent(course.youtubeQuery || '')}`,
                        '_blank'
                      )}
                    >
                      <Video className="ml-2 h-4 w-4" />
                      البحث في يوتيوب
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-10 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>الطلاب المسجلين</CardTitle>
              <CardDescription>
                {course.enrollments?.length || 0} طالب مسجل
              </CardDescription>
            </CardHeader>
            <CardContent>
              {course.enrollments?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الطالب</TableHead>
                      <TableHead>تاريخ التسجيل</TableHead>
                      <TableHead className="text-center">التقدم</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={enrollment.student.image || undefined} />
                              <AvatarFallback>
                                {enrollment.student.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p>{enrollment.student.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {enrollment.student.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(enrollment.enrolledAt).toLocaleDateString('ar-EG')}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={enrollment.progress === 100 ? 'default' : 'secondary'}>
                            {enrollment.progress}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm">
                            عرض التفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>لا يوجد طلاب مسجلين في هذه الدورة</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-10 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>محتوى الدورة</CardTitle>
              <CardDescription>
                {sortedLessons.length} درس
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedLessons.length > 0 ? (
                <div className="space-y-4">
                  {sortedLessons.map((lesson) => (
                    <Card key={lesson.videoId} className=" hover:bg-muted transition-colors cursor-pointer" onClick={() => router.push(`/teacher/courses/${courseId}/lessons/${lesson.videoId}`)}>
                      <div className="flex flex-col md:flex-row items-center justify-between mb-2">
                        <Image className="rounded-xl" src={lesson.thumbnail || ''} width={400} height={400} alt={''} />
                        <div className="flex-1 px-4 py-2">
                          <CardHeader>
                            <CardTitle >
                              <h3>الدرس {lesson.order}: {lesson.title}</h3>
                            </CardTitle>
                          </CardHeader>
                          <CardFooter>
                            <Button>
                              <Video className="ml-2 h-4 w-4" />
                              عرض الدرس
                            </Button>
                          </CardFooter>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>لا يوجد محتوى لهذه الدورة بعد</p>
                </div>
              )}
            <div>
              {content?.map((section: Content, index: number) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-right">{section.title}</h2>
          <p className="text-right text-gray-700 whitespace-pre-line">{section.content}</p>
        </div>
      ))}
            </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-10 md:mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الدورة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>عدد الطلاب المسجلين:</span>
                    <span className="font-medium">
                      {course.enrollments?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>متوسط التقدم:</span>
                    <span className="font-medium">
                      {course.enrollments?.length ?
                        Math.round(
                          course.enrollments.reduce((sum, e) => sum + e.progress, 0) /
                          course.enrollments.length
                        ) : 0
                      }%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>عدد الدروس:</span>
                    <span className="font-medium">
                      {sortedLessons.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>تاريخ الإنشاء:</span>
                    <span className="font-medium">
                      {new Date(course.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>اختبار الدورة</CardTitle>
                <CardDescription>
                  {course.quiz?.length ?
                    `${course.quiz[0].questions?.length || 0} سؤال` :
                    'لا يوجد اختبار'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {course.quiz?.length ? (
                  <div>
                    <h3 className="font-medium mb-2">{course.quiz[0].title}</h3>
                    <Button variant="outline" className="w-full">
                      عرض نتائج الاختبار
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>لم يتم إنشاء اختبار لهذه الدورة بعد</p>
                    <Button
                      variant="link"
                      className="mt-2"
                      onClick={() => router.push(`/teacher/courses/${courseId}/quiz`)}
                    >
                      إنشاء اختبار جديد
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}