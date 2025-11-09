"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReactConfetti from "react-confetti";
import { toast } from "sonner";

// SPA => Single Page Application | React
// CSR => Client Side Renering    | React 
// SSG => Server Side Generation  | Next
// SSR => Server Side Renering  

export default function GenerateCourseForm({ teacherId }: { teacherId: string }) {
  const router = useRouter();

  // حقول النموذج
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [field, setField] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [goals, setGoals] = useState("");
  const [keywords, setKeywords] = useState("");

  const [loading, setLoading] = useState(false);
  const [courseStatus, setCourseStatus] = useState(""); // مثل "generating" أو "created"
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [finalPrompt, setFinalPrompt] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

  // ضبط أبعاد النافذة للكونفيتي
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  // دالة إرسال النموذج
  const handleGenerateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      field,
      targetAudience,
      level,
      duration,
      goals,
      keywords,
      teacherId,
    };
    setLoading(true);
    setCourseStatus("generating");

    try {
      const response = await axiosInstance.post("/courses/", payload);
      // نتوقع أن يحتوي الرد على الدورة المُنشأة
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { course } = response.data;
      toast.success("تم إنشاء الدورة بنجاح!");
      setCourseStatus("created");
      setShowConfetti(true);
      // اختيارياً: يمكنك عرض النص النهائي إذا تم إرجاعه
      // setFinalPrompt(response.data.finalPrompt);

      // إعادة التوجيه بعد تأخير لإظهار الكونفيتي
      setTimeout(() => {
        router.push("/teacher/courses");
      }, 3000);
    } catch (error) {
      console.error("حدث خطأ أثناء إنشاء الدورة:", error);
      toast.error("حدث خطأ أثناء إنشاء الدورة، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showConfetti && (
        <ReactConfetti width={windowDimension.width} height={windowDimension.height} />
      )}
      <Card className="w-1/2 mx-auto my-8">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            إنشاء دورة جديدة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateCourse} className="space-y-4">
            <div>
              <Label htmlFor="title">عنوان الدورة</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="أدخل عنوان الدورة"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="أدخل وصف الدورة"
                required
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="field">المجال</Label>
              <Input
                id="field"
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="أدخل مجال الدورة"
                required
              />
            </div>
            <div>
              <Label htmlFor="targetAudience">الفئة المستهدفة</Label>
              <Input
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="أدخل الفئة المستهدفة"
                required
              />
            </div>
            <div>
              <Label htmlFor="level">مستوى الدورة</Label>
              <Input
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="أدخل مستوى الدورة (مثال: مبتدئ، متوسط، متقدم)"
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">المدة</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="أدخل مدة الدورة (مثال: 10 أسابيع، 3 أشهر)"
                required
              />
            </div>
            <div>
              <Label htmlFor="goals">الأهداف التعليمية</Label>
              <Textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="أدخل الأهداف التعليمية"
                required
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="keywords">الكلمات المفتاحية</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="أدخل الكلمات المفتاحية"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "جارٍ إنشاء الدورة..." : "إنشاء الدورة"}
            </Button>
          </form>

          {/* اختياري: عرض النص النهائي لغرض التصحيح */}
          {finalPrompt && !loading && (
            <div className="mt-6 p-4 bg-gray-100 rounded">
              <h3 className="font-bold mb-2">النص النهائي:</h3>
              <pre className="text-sm whitespace-pre-wrap">{finalPrompt}</pre>
            </div>
          )}

          {/* تحميل مؤقت أثناء الإنشاء */}
          {loading && courseStatus === "generating" && (
            <div className="mt-6 space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
