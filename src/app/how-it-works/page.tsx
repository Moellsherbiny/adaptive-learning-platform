import { GraduationCap, BookOpenCheck, UserCog, BarChart4, BadgeCheck, MessageSquareText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "التسجيل في المنصة",
      description: "قم بإنشاء حسابك كطالب أو معلم في دقائق معدودة"
    },
    {
      icon: <BookOpenCheck className="w-8 h-8" />,
      title: "استكشاف الدورات",
      description: "تصفح مجموعة واسعة من الدورات التعليمية في مختلف المجالات"
    },
    {
      icon: <UserCog className="w-8 h-8" />,
      title: "الانضمام أو الإنشاء",
      description: "سجل في الدورة كطالب أو أنشئ دورتك الخاصة كمعلم"
    },
    {
      icon: <BarChart4 className="w-8 h-8" />,
      title: "متابعة التقدم",
      description: "تابع تقدمك التعليمي من خلال لوحة التحليل الشخصية"
    },
    {
      icon: <BadgeCheck className="w-8 h-8" />,
      title: "الحصول على الشهادة",
      description: "احصل على شهادة إتمام عند إنهاء الدورة بنجاح"
    },
    {
      icon: <MessageSquareText className="w-8 h-8" />,
      title: "التقييم والتفاعل",
      description: "قدم ملاحظاتك وتفاعل مع المعلمين والزملاء"
    }
  ];

  const roles = [
    {
      title: "للطلاب",
      features: [
        "تصفح وتقييم الدورات التعليمية",
        "تعلم بالسرعة التي تناسبك",
        "احصل على تحليلات شخصية لأدائك",
        "تواصل مع المعلمين وزملاء الدراسة",
        "احصل على شهادات معتمدة"
      ]
    },
    {
      title: "للمعلمين",
      features: [
        "أنشئ دورات تعليمية متكاملة",
        "استخدم أدوات الذكاء الاصطناعي لإنشاء المحتوى",
        "تابع تقدم الطلاب",
        "قدم التغذية الراجعة للطلاب",
        "احصل على تقييمات الطلاب"
      ]
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20" dir="rtl">
        {/* Hero Section */}
        <section className="container py-12 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              كيف تعمل <span className="text-primary">منصتنا</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              دليل شامل لاستكشاف جميع ميزات المنصة التعليمية والاستفادة القصوى منها
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="container py-12 bg-background rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold text-center mb-12">خطوات البدء</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={index} className="hover:shadow-md transition-all h-full">
                <CardHeader>
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto">
                    {step.icon}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Roles Section */}
        <section className="container py-12 md:py-24">
          <h2 className="text-3xl font-bold text-center mb-12">ماذا نقدم لكل دور؟</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {roles.map((role, index) => (
              <Card key={index} className="border-primary/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{role.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {role.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 mt-1 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-12 text-center">
          <h2 className="text-2xl font-bold mb-6">جاهز للبدء في رحلة التعلم؟</h2>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="auth/signup">سجل حساب جديد</Link>
            </Button>

          </div>
        </section>
      </div>
    </>
  );
}