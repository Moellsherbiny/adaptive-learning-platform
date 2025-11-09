import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import testImage from "@/test.jpg";
import Testimonials from "@/components/home/Testimonials";
import { BookCheck, FileVolume, MonitorCheck, MonitorPlay } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center">
      
      <HeroSection />
      <FeaturesSection />

      
   <section dir="rtl" className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-100 w-full">
      <div className="container mx-auto px-4 md:px-8 text-center md:text-right">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-primary relative inline-block">
          نشاطات الطلاب
          <span className="absolute -bottom-2 right-0 w-24 h-1 bg-primary rounded-full"></span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { title: "محتوى مرئي", icon: <MonitorPlay className="w-8 h-8 text-white" /> },
            { title: "محتوى تفاعلي", icon: <MonitorCheck className="w-8 h-8 text-white" /> },
            { title: "مزيج صوتي", icon: <FileVolume className="w-8 h-8 text-white" /> },
            { title: "محتوى مقروء", icon: <BookCheck className="w-8 h-8 text-white" /> },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-8"
            >
              <div className="bg-gradient-to-br from-primary to-orange-400 w-20 h-20 rounded-full flex items-center justify-center shadow-md mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-2">{item.title}</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                أنشطة تعليمية متنوعة تساعد الطلاب على التفاعل والتعلم بطرق مختلفة.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>


      {/* Testimonials */}
      <Testimonials />

      {/* Call to Action */}
      <section className="py-20 bg-primary text-white text-center w-full">
        <div className="container mx-auto px-6 md:px-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ابدأ رحلتك التعليمية اليوم
          </h2>
          <p className="text-lg opacity-90 mb-10">
            انضم إلى آلاف الطلاب الذين يستخدمون منصتنا للتعلم بذكاء ومرونة.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary font-semibold hover:bg-gray-100 transition"
          >
            <Link href="/auth/signup">ابدأ الآن مجاناً</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
