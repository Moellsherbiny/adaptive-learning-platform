import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, BookCopy, Book } from "lucide-react";
import Navbar from "@/components/DashboardNav";
import { getUserData } from "@/lib/getUserData";

const StudentDashboard = async () => {
  const links = [
    {
      title: "دوراتي",
      icon: <Book className="w-8 h-8 text-blue-500" />,
      path: "/student/my-courses",
    },
    {
      title: "الدورات التعليمية",
      icon: <BookCopy className="w-8 h-8 text-green-500" />,
      path: "/student/courses",
    },
    {
      title: "ملاحظات المعلم",
      icon: <MessageCircle className="w-8 h-8 text-yellow-500" />,
      path: "/student/feedback",
    },

  ];

  const user = await getUserData();
  const timeDayOrNight = new Date().getHours() < 12 ? "صباح" : "مساء";
  const greeting = ` ${timeDayOrNight} الخير ${user.name?.split(' ')[0] ?? 'User'}`;
  return (
    <div dir="rtl" className="bg-gray-100 min-h-screen">
      <Navbar name={user.name ?? ""} image={user.image ?? ""} role="student" />
      <div className="container min-h-[calc(100vh-72px)] flex flex-col justify-center mx-auto p-6">
        <h1 className="text-3xl text-center font-bold mb-6">{greeting}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {links.map((link, index) => (
            <Link key={index} href={link.path} className="block">
              <Card className="cursor-pointer hover:shadow-lg transition duration-300">
                <CardHeader className="flex items-center gap-4">
                  {link.icon}
                  <CardTitle>{link.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">إدارة {link.title}.</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
