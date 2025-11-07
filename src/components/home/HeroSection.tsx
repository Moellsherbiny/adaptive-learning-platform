// import Link from "next/link";
import Image from "next/image";
import heroImage from "@/assets/hero.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-primary  pb-16 md:py-16  text-white">
      <div className="container mx-auto px-4 md:px-16 flex flex-col-reverse md:flex-row md:justify-center items-center">
        <div className="md:w-1/2 mt-8 md:mt-0 text-center md:text-right  relative">
          <h1 className="text-2xl md:w-3/4  md:text-3xl font-bold leading-10 mb-4">
            تعلم ما تشاء تعلمة

            في أي مكان وكل وقت

          </h1>

          <p className="text-xl font-regular ">
            اكتشف الآن تجربة تعلم من المستقبل بين يديك
          </p>
          <div className="mt-8 w-full">
            <Button variant="default" className="bg-secondary text-primary w-full md:w-auto mb-8 md:mb-0  md:ml-10" >
              <Link href="/dashboard" >
               لوحة التحكم
              </Link>
            </Button>
            <Button variant="outline" className="bg-transparent text-secondary w-full md:w-auto">
              <Link href="/about"> معرفة المزيد</Link>
            </Button>
          </div>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0">

          <Image src={heroImage} alt="student setting and thinking" width={100} height={100} className="w-full" />
        </div>

      </div>
    </section>
  );
}
