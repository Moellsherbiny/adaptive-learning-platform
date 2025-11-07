import AudioParagraphs from '@/components/audioParagraphs';
import prisma from "@/lib/prisma"

// const units = [
//   {
//     title: "الوحدة الأولى: مقدمة إلى عالم الفوتوشوب",
//     content: "يُستخدم برنامج الفوتوشوب في تعديل الصور وإنشاء التصميمات الرسومية والتعامل مع الطبقات والمؤثرات..."
//   },
//   {
//     title: "الوحدة الثانية: إعداد مشروع جديد وفهم مساحة العمل",
//     content: "يتم فتح مشروع جديد من قائمة File ثم اختيار New..."
//   },
//   {
//     title: "الوحدة الثالثة: إدراج صورة والتعديل عليها",
//     content: "لإدراج صورة، يُستخدم الأمر File > Place Embedded، أو تُسحب الصورة مباشرة..."
//   },
//   {
//     title: "الوحدة الرابعة: التحديد والقص الاحترافي",
//     content: "تُستخدم أداة التحديد السريع (Quick Selection) لتحديد العنصر داخل الصورة..."
//   },
//   {
//     title: "الوحدة الخامسة: الطبقات والأقنعة",
//     content: "كل عنصر يُضاف داخل الفوتوشوب يُوضع في طبقة مستقلة..."
//   },
//   {
//     title: "الوحدة السادسة: الكتابة وتنسيق النصوص",
//     content: "تُستخدم أداة الكتابة (Type Tool) للنقر على مساحة العمل وبدء كتابة النص..."
//   },
//   {
//     title: "الوحدة السابعة: الفلاتر والتأثيرات",
//     content: "يُحدد العنصر أو الطبقة، ثم يُذهب إلى قائمة Filter..."
//   },
//   {
//     title: "الوحدة الثامنة: الدمج والتركيب",
//     content: "تُفتح أكثر من صورة داخل المشروع، وتُقص العناصر المطلوبة..."
//   },
//   {
//     title: "الوحدة التاسعة: تصميم شعار وبطاقة",
//     content: "تُستخدم أداة الشكل لرسم دائرة أو مستطيل كنقطة بداية..."
//   },
//   {
//     title: "الوحدة العاشرة: الحفظ والتصدير",
//     content: "بعد الانتهاء من التصميم، يُحفظ المشروع بصيغة PSD للاحتفاظ بالطبقات..."
//   },
// ];

interface Props{
    params: Promise<{courseId?: string}>
}

export default async function HomePage({params}: Props) {
    const {courseId  } = await params
    console.log(courseId)
    const courseContent = await prisma.course.findUnique({where:{id:courseId}})

    console.log(courseContent?.generatedContent)
    
    return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-indigo-800">{courseContent?.title}</h1>
      <AudioParagraphs units={courseContent?.generatedContent} />
    </main>
  );
}
