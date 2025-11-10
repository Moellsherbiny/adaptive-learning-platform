import { RocketIcon, BookOpenIcon, UsersIcon, BarChartIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function AboutPage() {
  const features = [
    {
      icon: <BookOpenIcon className="w-6 h-6" />,
      title: "دورات شاملة",
      description: "مواد تعليمية تفاعلية مع دروس منظمة ومحتوى متعدد الوسائط"
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: "مدربون خبراء",
      description: "تعلم من معلمين مؤهلين ذوي خبرة في المجال"
    },
    {
      icon: <BarChartIcon className="w-6 h-6" />,
      title: "تتبع التقدم",
      description: "تابع رحلة تعلمك مع تحليلات مفصلة"
    },
    {
      icon: <RocketIcon className="w-6 h-6" />,
      title: "أدوات ذكاء اصطناعي",
      description: "توليد محتوى ذكي وتوصيات مخصصة"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20" dir="rtl">
        <section className="container py-12 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              ثورة في <span className="text-primary">التعليم</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              تربط منصتنا بين المعلمين والطلاب باستخدام التكنولوجيا الحديثة
              وتجارب التعلم الشخصية
            </p>
          </div>
        </section>

        <section className="container py-12 bg-background rounded-lg shadow-sm">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-center">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container py-12 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">قصتنا</h2>
            <div className="space-y-6 text-muted-foreground text-lg">
              <p>
                بدأنا رحلتنا في عام 2025 بهدف تحويل تجربة التعليم الإلكتروني. نؤمن بأن التعلم
                يجب أن يكون شخصياً، تفاعلياً، ومتاحاً للجميع.
              </p>
              <p>
                تجمع منصتنا بين أحدث تقنيات الذكاء الاصطناعي والخبرة التعليمية لتقديم
                حلول تعليمية مبتكرة تلبي احتياجات كل من المعلمين والطلاب.
              </p>
              <p>
                اليوم، نفخر بكوننا مجتمعاً تعليمياً مزدهراً يضم آلاف المستخدمين
                من مختلف أنحاء العالم العربي.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}