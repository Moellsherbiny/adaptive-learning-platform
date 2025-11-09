
import Image from "next/image";
import heroImage from "@/assets/hero.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserData } from "@/lib/getUserData";
export default async function HeroSection() {
  const user = await getUserData()

  return (
    <section className="relative container text-white overflow-hidden">
      <div className="px-4 md:px-8 py-8 md:py-16  flex flex-col-reverse md:flex-row items-center md:justify-between gap-10 rounded-xl bg-primary">

        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-right">
          <h1 className="text-3xl md:text-5xl font-bold leading-snug mb-6">
            تعلم ما تشاء، في أي مكان وكل وقت
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            اكتشف تجربة تعلم من المستقبل بين يديك — بذكاء، تفاعل، وتخصيص.
          </p>

          <div className="flex flex-col md:flex-row justify-center md:justify-start gap-4">
            {user.error ?
              <Button
                asChild
                variant="secondary"
                className="transition w-full md:w-auto"
              >
                <Link href="/auth/signup">البدء الآن</Link>
              </Button>
              :
              <Button
                asChild
                variant="secondary"
                className="transition w-full md:w-auto"
              >
                <Link href="/dashboard">لوحة التحكم</Link>
              </Button>
            }

            <Button
              asChild
              variant="outline"
              className="bg-transparent transition w-full md:w-auto"
            >
              <Link href="/about">معرفة المزيد</Link>
            </Button>
          </div>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2">
          <div className="relative">
            <div className="absolute -inset-4 bg-white/10 blur-3xl rounded-full animate-pulse" />
            <Image
              src={heroImage}
              alt="طالب يتعلم عبر الإنترنت"
              width={600}
              height={400}
              className="relative w-full drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay for aesthetic depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/30 pointer-events-none" />
    </section>
  );
}
