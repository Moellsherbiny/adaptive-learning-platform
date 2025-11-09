"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { axiosInstance } from "@/lib/axiosInstance";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "من فضلك أدخل الاسم الكامل";
    if (!email) newErrors.email = "من فضلك أدخل البريد الإلكتروني";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "البريد الإلكتروني غير صالح";

    if (!password) newErrors.password = "من فضلك أدخل كلمة المرور";
    else if (password.length < 6)
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";

    if (!confirmPassword)
      newErrors.confirmPassword = "يرجى تأكيد كلمة المرور";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "كلمتا المرور غير متطابقتين";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("تم إنشاء الحساب بنجاح");
        await signIn("credentials", { email, password });
      } else {
        toast.error("حدث خطأ، حاول مرة أخرى");
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "حدث خطأ أثناء إنشاء الحساب. حاول لاحقًا.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.01]">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h1 className="text-3xl font-semibold text-gray-800 mt-4">إنشاء حساب جديد</h1>
          <p className="text-gray-500 text-sm mt-1">ابدأ رحلتك معنا 🚀</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Name */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input
              type="text"
              id="name"
              placeholder="اسمك كاملا هنا"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`py-2 ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              type="email"
              id="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`py-2 ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
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
              className={errors.password ? "border-red-500 focus:ring-red-500" : ""}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={
                errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""
              }
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Submit */}
          <Button
            variant="default"
            type="submit"
            disabled={loading}
            className="w-full text-lg transition-colors duration-200 hover:bg-blue-600"
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-3 text-gray-500 text-sm">أو</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Sign Up */}
        <Button
          onClick={() => signIn("google")}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 transition-all"
        >
          <FcGoogle className="text-2xl" />
          التسجيل بواسطة جوجل
        </Button>

        {/* Link to Sign in */}
        <div className="text-center mt-6">
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:text-blue-800 flex justify-center items-center gap-1 transition-colors"
          >
            تسجيل الدخول <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
