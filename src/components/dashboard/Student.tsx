import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, BookCopy, Book } from "lucide-react";
import { getUserData } from "@/lib/getUserData";

const StudentDashboard = async () => {
  const links = [
    {
      title: "دوراتي",
      icon: <Book className="w-8 h-8 text-blue-500" />,
      path: "/student/my-courses",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      description: "تصفح وإدارة دوراتك المسجلة"
    },
    {
      title: "الدورات التعليمية",
      icon: <BookCopy className="w-8 h-8 text-green-500" />,
      path: "/student/courses",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      description: "استكشف الدورات المتاحة"
    },
    {
      title: "ملاحظات المعلم",
      icon: <MessageCircle className="w-8 h-8 text-amber-500" />,
      path: "/student/feedback",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      description: "راجع ملاحظات معلميك"
    },
  ];

  const user = await getUserData();
  const timeDayOrNight = new Date().getHours() < 12 ? "صباح" : "مساء";
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
            ماذا تريد أن تتعلم اليوم؟
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  ابدأ رحلتك التعليمية اليوم
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  استكشف الدورات التعليمية المتاحة وابدأ في تطوير مهاراتك. التعلم المستمر هو مفتاح النجاح.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;