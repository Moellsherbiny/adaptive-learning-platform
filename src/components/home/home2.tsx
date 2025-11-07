"use client";

import Navbar from "@/components/DashboardNav";
import Footer from "@/components/Footer";
import Image from "next/image";
import testImage from "@/test.jpg";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
export default function HomePage({name,image,role}:{name:string,image:string,role: string}) {
  return (
    <div>
     <Navbar name={name} image={image} role={role}/>
      <main>
        <HeroSection/>
        {/* Second Section: Repeated Pattern */}
        <FeaturesSection />
        {/* Third Section: Course Samples */}
        <section className="py-16">
          <div className="container mx-auto md:px-16">
            <h2 className="text-3xl font-bold mb-8">نشاطات الطلاب</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Image
                  src={testImage}
                  width={300}
                  height={600}
                  alt="محتوى فيديو"
                  className="w-full rounded-lg shadow-lg"
                />
                <h3 className="mt-4 text-xl font-semibold">محتوى فيديو</h3>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  src={testImage}
                  width={300}
                  height={600}
                  alt="محتوى صور"
                  className="w-full rounded-lg shadow-lg"
                />
                <h3 className="mt-4 text-xl font-semibold">محتوى صور</h3>
              </div>
              <div className="flex flex-col items-center">
                <Image

                  src={testImage}
                  width={300}
                  height={600}
                  alt="مزيج المحتوى"
                  className="w-full rounded-lg shadow-lg"
                />
                <h3 className="mt-4 text-xl font-semibold">مزيج المحتوى</h3>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
