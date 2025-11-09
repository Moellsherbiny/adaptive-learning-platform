"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";

const Navbar = ({ name, image, role }: { name: string; image: string; role: string }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = role === "teacher"
    ? [
        { href: "/dashboard", label: "لوحة التحكم" },
        { href: "/teacher/courses", label: "الدورات" },
        { href: "/teacher/students", label: "الطلاب" },
      ]
    : [
        { href: "/dashboard", label: "لوحة التحكم" },
        { href: "/student/courses", label: "الدورات التعليمية" },
        { href: "/student/my-courses", label: "دوراتي" },
        { href: "/testimonials", label: "قيم تجربتك" },
      ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* User Avatar - Desktop */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                  <AvatarImage src={image || "https://github.com/shadcn.png"} alt={name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 mt-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {role === "teacher" ? "معلم" : "طالب"}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    الملف الشخصي
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer">
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-gray-600 rounded transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-gray-600 rounded transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-gray-600 rounded transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4 bg-white space-y-1">
          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-lg mb-3">
            <Avatar>
              <AvatarImage src={image || "https://github.com/shadcn.png"} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="text-xs text-gray-500">{role === "teacher" ? "معلم" : "طالب"}</p>
            </div>
          </div>

          {/* Navigation Links */}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="border-t border-gray-100 my-2"></div>

          {/* Actions */}
          <Link
            href="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            الملف الشخصي
          </Link>
          <button
            onClick={() => signOut()}
            className="block w-full text-right px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;