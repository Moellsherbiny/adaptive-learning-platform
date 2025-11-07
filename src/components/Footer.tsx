"use client";
export default function Footer() {
  return (
    <footer className="bg-blue-900 text-gray-200 pt-8 pb-4" dir="rtl">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* نبذة */}
        {/*
        <div>
          <h3 className="text-xl font-bold mb-4">كيف يعمل المشروع</h3>
          
        </div>
        */}
        {/* روابط سريعة */}
        {/*
        <div>
          <h3 className="text-xl font-bold mb-4">المشروع</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-gray-400 hover:text-white transition">الرئيسية</Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-400 hover:text-white transition">حول المشروع</Link>
            </li>
            <li>
              <Link href="/how-it-works" className="text-gray-400 hover:text-white transition">كيف تعمل؟</Link>
            </li>
          </ul>
        </div>
        */}
      
        <div className="flex flex-col items-center space-y-3">
          {/*<Image src={logoImage} width={100} height={100} alt="Logo" />*/}
          <ul className="space-y-2 text-center md:w-72">
            <li>Requirement to get a master degree </li>
            <li>mai_badran@du.edu.eg</li>
          
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-white">
        &copy; {new Date().getFullYear()} جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
