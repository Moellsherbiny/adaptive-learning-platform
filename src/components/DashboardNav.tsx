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

const Navbar = ({ name, image, role }: { name: string; image: string; role:string }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  console.log(role)
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const links = role === "teacher"
    ?
    [
      { href: "/dashboard", label: "لوحة التحكم" },
      { href: "/teacher/courses", label: "الدورات" },
      { href: "/teacher/students", label: "الطلاب" },
    ]
    : [
      { href: "/dashboard", label: "لوحة التحكم" },
      { href: "/student/courses", label: "الدورات التعليمية" },
      { href: "/student/my-courses", label: "دوراتي" },
      
    ];

  return (
    <nav className=" p-4 text-primary shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="order-1">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="order-2 hidden md:flex flex-row-reverse items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src={image || "https://github.com/shadcn.png"}
                  alt="صورة المستخدم"
                />
                <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/profile" className="flex items-center gap-2">
                  الملف الشخصي
                </Link>

              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>تسجيل الخروج</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden order-2">
          <button onClick={toggleMobileMenu} className="p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mt-4 flex flex-col gap-2 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={image || "https://github.com/shadcn.png"}
                    alt="صورة المستخدم"
                  />
                  <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span>الملف الشخصي</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>تسجيل الخروج</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
