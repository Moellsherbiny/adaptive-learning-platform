"use client";

import { useState } from "react";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يحتوي على حرفين على الأقل"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  message: z.string().min(5, "الرسالة قصيرة جدًا"),
});

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = () => {
    const result = formSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setSuccess(false);
      return;
    }

    setErrors({});
    setSuccess(true);

    const { name, email, message } = form;
    const subject = encodeURIComponent(`رسالة من ${name}`);
    const body = encodeURIComponent(`البريد الإلكتروني: ${email}\n\nالرسالة:\n${message}`);

    window.location.href = `mailto:mai_badran@du.edu.eg?subject=${subject}&body=${body}`;
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/100 via-white to-orange-50 p-6"
    >
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-md transition-all hover:shadow-2xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary mb-2">
            تواصل معنا
          </CardTitle>
          <p className="text-gray-500 text-sm">
            يسعدنا تواصلك معنا! أرسل رسالتك وسنرد عليك قريبًا.
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-5 mt-2">
            <div>
              <label className="text-sm font-medium text-gray-700">الاسم الكامل</label>
              <Input
                name="name"
                placeholder="اكتب اسمك هنا"
                value={form.name}
                onChange={handleChange}
                className="mt-1 border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-right"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
              <Input
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={handleChange}
                className="mt-1 border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-right"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">الرسالة</label>
              <Textarea
                name="message"
                placeholder="اكتب رسالتك هنا..."
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="mt-1 border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-right"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <Button
              onClick={handleSend}
              disabled={!form.name || !form.email || !form.message}
              className="w-full mt-2 bg-primary text-white hover:bg-primary/90 transition-all rounded-xl py-5 text-lg font-semibold"
            >
              إرسال الرسالة
            </Button>

            {success && (
              <p className="text-green-600 text-center text-sm mt-2">
                تم التحقق من البيانات بنجاح، جاري فتح البريد لإرسال الرسالة...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
