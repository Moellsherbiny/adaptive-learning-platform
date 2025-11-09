"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronLeft, Home } from "lucide-react";

// Map of route names in Arabic
const routeNames: Record<string, string> = {
  dashboard: "لوحة التحكم",
  student: "الطالب",
  teacher: "المعلم",
  courses: "الدورات",
  "my-courses": "دوراتي",
  feedback: "الملاحظات",
  new: "جديد",
  profile: "الملف الشخصي",
  about: "معرفة المزيد",
  "how-it-works": "كيف تعمل",
  "signin": "تسجيل الدخول",
  "signup": "إنشاء حساب",
  "testimonials":"تقييم الطالب للمنصة",
  "contact":"تواصل معنا"
};

export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  
  
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  
  // Don't show breadcrumb on home page
  if (pathSegments.length === 0) {
    return null;
  }
  const isAuthRoute = pathSegments[0] === "auth";

  // Build breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;
    const label = routeNames[segment] || segment;
    return {
      href,
      label,
      isLast,
    };
  });

  if(isAuthRoute){
    return null
  }
  return (
    <div className="bg-white border-b border-gray-100 py-3">
      <div className="container mx-auto px-4 lg:px-8">
        <Breadcrumb dir="rtl">
          <BreadcrumbList>
            {/* Home Link */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors">
                  <Home className="w-4 h-4" />
                  <span>الرئيسية</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {/* Dynamic Breadcrumb Items */}
            {breadcrumbItems.map((item, index) => (
              <div key={item.href} className="flex items-center">
                <BreadcrumbSeparator>
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {item.isLast ? (
                    <BreadcrumbPage className="font-medium text-primary">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <span
                       
                        className="text-gray-600 hover:text-primary transition-colors"
                      >
                        {item.label}
                      </span>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}