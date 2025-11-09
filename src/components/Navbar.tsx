"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "معرفة المزيد" },
  { href: "/how-it-works", label: "كيف تعمل؟" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const path = usePathname();
  const currentPath = path.split("/")[1];
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-primary/95 border-b border-white/10">
      <nav className="container px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo with subtle animation */}
        <div className="hover:scale-105 transition-transform duration-300">
          <Logo />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center justify-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-2 text-gray-500 hover:text-gray-800 transition-all duration-300 group"
            >
              {link.label}
              <span className={`absolute bottom-0 right-0  h-[1px]
                                bg-primary
                                transition-all duration-300 
                                ${`/${currentPath}` === link.href ? "w-2/4" : "w-0 group-hover:w-2/4"}`}>
              </span>
            </Link>
          ))}
        </div>
        <Button variant="default" className="hidden md:flex rounded-lg px-6 shadow-lg hover:shadow-xl" asChild>
          <Link href="/auth/signin" >
            تسجيل الدخول
          </Link>
        </Button>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center group"
          aria-label="Toggle Menu"
        >
          <div className="relative w-6 h-5 flex flex-col justify-between">
            <span
              className={`block h-0.5 w-full bg-gray-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
            ></span>
            <span
              className={`block h-0.5 w-full bg-gray-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""
                }`}
            ></span>
            <span
              className={`block h-0.5 w-full bg-gray-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
            ></span>
          </div>
        </button>
      </nav>

      {/* Mobile Menu - Sleek Design */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96" : "max-h-0"
          }`}
      >
        <div className="backdrop-blur-xl bg-white/95 border-t border-gray-200/50 shadow-2xl">
          <div className="container px-4 py-6 space-y-1">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full"></span>
                  {link.label}
                </span>
              </Link>
            ))}

            <div className="pt-4">
              <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg">
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}