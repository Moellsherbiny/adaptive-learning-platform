import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus, MessageCircle, BookCopy } from "lucide-react";
import Navbar from "@/components/DashboardNav";
import { getUserData } from "@/lib/getUserData";

const TeacherDashboard = async () => {
  const links = [
    {
      title: "إنشاء دورة",
      icon: <FilePlus className="w-8 h-8 text-blue-500" />,
      path: "/teacher/courses/new",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      description: "أنشئ دورة تعليمية جديدة"
    },
    {
      title: "الدورات التعليمية",
      icon: <BookCopy className="w-8 h-8 text-green-500" />,
      path: "/teacher/courses",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      description: "إدارة ومتابعة دوراتك"
    },
    {
      title: "إرسال ملاحظات",
      icon: <MessageCircle className="w-8 h-8 text-amber-500" />,
      path: "/teacher/feedback",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      description: "تقديم الملاحظات للطلاب"
    },
  ];

  const user = await getUserData();
  const timeDayOrNight = new Date().getHours() < 18 ? "صباح" : "مساء";
  const greeting = `${timeDayOrNight} الخير، ${user.name?.split(' ')[0] ?? 'User'}`;
  
  return (
    <div dir="rtl" className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Welcome Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            {greeting}
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            كيف يمكنك مساعدة طلابك اليوم؟
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {links.map((link, index) => (
            <Link key={index} href={link.path} className="group">
              <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
                <div className={`h-2 bg-gradient-to-r ${link.color}`}></div>
                
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 ${link.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {link.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {link.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {link.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-primary transition-colors">
                    <span>انتقل</span>
                    <svg className="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Motivational Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  أنت تصنع الفرق في حياة طلابك
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  كل درس تقدمه وكل ملاحظة تكتبها تساهم في بناء مستقبل أفضل. استمر في الإلهام والتعليم.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;