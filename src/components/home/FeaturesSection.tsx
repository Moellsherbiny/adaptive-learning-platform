import Image from "next/image";
import studnt from "@/assets/student.svg";


export default function HeroSection() {
  return (
    <section className="relative text-primary md:pt-10">
      <div className="container mx-auto px-4 md:px-16 flex flex-col md:flex-row md:justify-center items-center">
        <div className="md:w-1/2 mt-8 md:mt-0">
          <Image src={studnt} alt="student setting and thinking" width={100} height={100} className="w-full" />
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 text-center md:text-right  relative">
          <h1 className="text-2xl md:w-3/4  md:text-3xl text-justify font-bold  mb-4">
          قم بإعداد دورتك التعليمية وتخصيصها كما تشاء وانتظر التأثير الإبداعي

          </h1>

          <p className="text-xl font-regular text-justify ">
          واكب الآن تجربة التعلم الفريدة والحديثة باستخدام الذكاء الاصطناعي في كل وقت وكل مكان بتجربة تعلم جديدة ومخصصة حسب مستواك وتفضيلاتك فلا تقلق، ما عليك سوي التقدم الآن والبدء في التسجيل بالمنصة.
          </p>

        </div>


      </div>
    </section>
  );
}
