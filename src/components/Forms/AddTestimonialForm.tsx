"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axiosInstance";
import ReactConfetti from "react-confetti";

const testimonialSchema = z.object({
  name: z.string().optional(),
  content: z
    .string()
    .min(10, "الرسالة يجب ألا تقل عن 10 أحرف")
    .max(300, "الرسالة لا يجب أن تتجاوز 300 حرف"),
  rating: z.string().nonempty("يرجى اختيار التقييم"),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export default function AddTestimonialForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await axiosInstance.get("users")
      setName(data.data.name)
      setAvatar(data.data.avatar || "")
    }
    getUser()
  }, [])

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { name, content: "", rating: "" },
  });


const onSubmit = async (data: TestimonialFormValues) => {
  try {
    setIsSubmitting(true);

    const res = await axiosInstance.post("/testimonials", {
      name: name,
      content: data.content,
      rating: data.rating,
      avatar: avatar,
    });

    if (res.status === 201) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      toast.success("تم الإرسال بنجاح 🎉", {
        description: `شكراً ${data.name} على رأيك!`,
      });

      form.reset();
    } else {
      toast.error("لم يتم إضافة الرأي", {
        description: res.data?.message || "حدث خطأ غير متوقع",
      });
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    // eslint-disable-next-line
  } catch (error: any) {
    toast.error("فشل الإرسال", {
      description:
        error.response?.data?.message ||
        "يرجى التحقق من الاتصال أو المحاولة لاحقاً",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Form {...form}>
      {showConfetti && <ReactConfetti width={window.innerWidth} height={window.innerHeight}/>}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        dir="rtl"
      >
        {/* الاسم */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الكامل</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسمك الكامل" {...field} value={name} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* الرسالة */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الرسالة</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="اكتب رأيك في المنصة..."
                  className="resize-none h-28"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* التقييم */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>التقييم</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التقييم من 1 إلى 5" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} نجوم
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* زر الإرسال */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? "جاري الإرسال..." : "إرسال"}
        </Button>
      </form>
    </Form>
  );
}
