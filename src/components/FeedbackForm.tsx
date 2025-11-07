"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axiosInstance";
import { toast } from "sonner";

interface FeedbackFormProps {
  teacherId: string;
  studentId: string;
}

export default function FeedbackForm({ teacherId, studentId }: FeedbackFormProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { teacherId, studentId, feedback };
      // نفترض وجود نقطة نهاية API على /feedback/create لتخزين الملاحظات
      await axiosInstance.post("/feedback", payload);
      toast.success("تم إرسال الملاحظات بنجاح!");
      router.push("/teacher/feedback");
    } catch (error) {
      console.error("خطأ أثناء إرسال الملاحظات:", error);
      toast.error("حدث خطأ أثناء إرسال الملاحظات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      <div>
        <label htmlFor="feedback" className="block mb-1 font-bold">
          ملاحظاتك
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="اكتب ملاحظاتك هنا..."
          required
          className="w-full border p-2 rounded"
          rows={5}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {loading ? "جارٍ الإرسال..." : "إرسال الملاحظات"}
      </button>
    </form>
  );
}
