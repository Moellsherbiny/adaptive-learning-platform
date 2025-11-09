import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axiosInstance";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { UsersRound } from "lucide-react";

export type TestimonialType = {
  id: number;
  name: string;
  university?: string;
  content: string;
  rating?: number;
  avatar?: string;
  createdAt: Date;
};

export default async function TestimonialsSection() {
  const { data } = await axiosInstance.get("/testimonials");
  const testimonials: TestimonialType[] = data.data;
  console.log(testimonials);
  if (testimonials.length === 0) {

    return (
      <section className="container px-4 md:px-8 py-20">
         <h2 className="text-3xl md:text-4xl font-bold mb-12 text-primary relative inline-block">
            ماذا يقول الطلاب عن التجربة
          <span className="absolute -bottom-4 right-0 w-24 h-1 bg-primary rounded-full"></span>
          </h2>
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <UsersRound />
            </EmptyMedia>
            <EmptyTitle>لا توجد تقييمات حتي الآن</EmptyTitle>
          </EmptyHeader>
        </Empty>
      </section>
    )
  }
  return (
    <section className="container  py-20">
      <div className="mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          ماذا يقول طلابنا
        </h2>
        <p className="text-slate-600 mb-12">
          تجربة الطلاب الحقيقية للمنصة.
        </p>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card
              key={t.id}
              className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-2xl"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full overflow-hidden">
                <p className="text-slate-700 mb-6 leading-relaxed text-sm md:text-base text-center md:text-start">
                  {t.content}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-start">
                    <div className="font-semibold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.university}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
