"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "من فضلك أدخل البريد الإلكتروني";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "البريد الإلكتروني غير صالح";

    if (!password) newErrors.password = "من فضلك أدخل كلمة المرور";
    else if (password.length < 6)
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCredentialsSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setErrors({ password: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 transition-transform duration-300 hover:scale-[1.01]">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h1 className="text-3xl font-semibold text-gray-800 mt-4">تسجيل الدخول</h1>
          <p className="text-gray-500 text-sm mt-1">مرحبًا بعودتك 👋</p>
        </div>

        {/* Form */}
        <form onSubmit={handleCredentialsSignIn} className="space-y-5">
          {/* Email */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              type="email"
              id="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`p-2 ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`p-2 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-3 text-lg transition-colors duration-200 hover:bg-blue-600"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-3 text-gray-500 text-sm">أو</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Sign-In */}
        <Button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 transition-all"
        >
          <FcGoogle className="text-2xl" />
          دخول بواسطة جوجل
        </Button>

        {/* Sign up link */}
        <div className="text-center mt-6">
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-800 flex justify-center items-center gap-1 transition-colors"
          >
            إنشاء حساب جديد <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
