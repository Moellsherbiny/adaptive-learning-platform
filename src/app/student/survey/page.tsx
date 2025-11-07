"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { axiosInstance } from "@/lib/axiosInstance";

const questions = [
  {
    id: "learningStyle",
    type: "single",
    question: "ما هو أسلوب التعلم المفضل لديك عند تعلم شيئا جديدا",
    options: ["تري صورة او رسم توضيحي", "تسمع لشرح صوتي أو محاضرة عنه", "تقرأ عنه في كتاب أو مذكرة", "تجرب بنفسك"]
  },
  {
    id: "learningStyle2",
    type: "single",
    question: "في وقت الامتحان تتذكر المعلومات التي:",
    options: ["شاهدت رسومات أو صور لها", "سمعتها من المعلم", "قرأتها وكتبتها بنفسك", "طبقتها في تجربة أو نشاط"]
  },
  {
    id: "goal",
    type: "single",
    question: "ما هو هدفك الأساسي من الدورة؟",
    options: ["الفهم الأكاديمي", "التطبيق العملي", "التحضير للوظيفة", "تحسين المهارات"]
  },
  {
    id: "pace",
    type: "single",
    question: "ما هو معدل التعلم المناسب لك؟",
    options: ["سريع", "متوسط", "بطيء"]
  },
  {
    id: "engagement",
    type: "multi",
    question: "ما أنواع التفاعل التي تفضلها؟",
    options: ["اختبارات", "مشاريع عملية", "مناقشات", "أنشطة تفاعلية"]
  },
  {
    id: "groupLearning",
    type: "boolean",
    question: "هل تفضل التعلم ضمن مجموعة؟"
  },
  {
    id: "experience",
    type: "single",
    question: "ما هو مستواك الحالي في هذا المجال؟",
    options: ["مبتدئ", "متوسط", "متقدم"]
  }
];

export default function PreferencesForm() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const currentQuestion = questions[currentStep];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const toggleCheckbox = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter((o: string) => o !== option) };
      } else {
        return { ...prev, [questionId]: [...current, option] };
      }
    });
  };

  const handleSubmit = async () => {
    // const prompt = `حدد نوع المحتوى المناسب لهذا الطالب بناءً على التفضيلات التالية: ${JSON.stringify(
    //   answers
    // )}`;

    const response = await axiosInstance.post("/student/survey", {
 
      topic:JSON.stringify(answers)
    });

    const data = await response.data;
    alert("اقتراح المحتوى: " + data.result);
  };

  const progress = (currentStep / questions.length) * 100;

  return (
    <div dir="rtl" className="max-w-xl mx-auto py-10 px-4">
      <motion.h1
        className="text-3xl font-bold text-center text-purple-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        استبيان تفضيلاتك التعليمية
      </motion.h1>

      <Progress value={progress} className="mb-6 h-3 bg-purple-200" />

      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-6 border-2 border-purple-400">
          <CardContent className="py-4">
            <p className="font-medium text-lg text-purple-800 mb-3">
              {currentQuestion.question}
            </p>

            {currentQuestion.type === "single" && (
              <RadioGroup
              dir="rtl"
                onValueChange={(val) => handleChange(currentQuestion.id, val)}
                value={answers[currentQuestion.id] || ""}
              >
                {currentQuestion.options?.map((option) => (
                  <div
                    key={option}
                    className="flex items-center space-x-3 space-x-reverse mb-2"
                  >
                    <RadioGroupItem
                      value={option}
                      id={`${currentQuestion.id}-${option}`}
                    />
                    <Label htmlFor={`${currentQuestion.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === "multi" && (
              <div>
                {currentQuestion.options?.map((option) => (
                  <div
                    key={option}
                    className="flex items-center space-x-3 space-x-reverse mb-2"
                  >
                    <Checkbox
                      id={`${currentQuestion.id}-${option}`}
                      checked={answers[currentQuestion.id]?.includes(option) || false}
                      onCheckedChange={() => toggleCheckbox(currentQuestion.id, option)}
                    />
                    <Label htmlFor={`${currentQuestion.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )}

           {currentQuestion.type === "boolean" && (
  <RadioGroup
    onValueChange={(val) =>
      handleChange(currentQuestion.id, val === "yes")
    }
    value={
      answers[currentQuestion.id] === true
        ? "yes"
        : answers[currentQuestion.id] === false
        ? "no"
        : ""
    }
    className="flex gap-6"
  >
    <div className="flex items-center space-x-2 space-x-reverse">
      <RadioGroupItem
        id={`${currentQuestion.id}-yes`}
        value="yes"
      />
      <Label htmlFor={`${currentQuestion.id}-yes`}>نعم</Label>
    </div>
    <div className="flex items-center space-x-2 space-x-reverse">
      <RadioGroupItem
        id={`${currentQuestion.id}-no`}
        value="no"
      />
      <Label htmlFor={`${currentQuestion.id}-no`}>لا</Label>
    </div>
  </RadioGroup>
)}

          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-between mt-4">
        <Button onClick={handlePrev} disabled={currentStep === 0} variant="outline">
          السابق
        </Button>

        {currentStep === questions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={!answers[currentQuestion.id]}>تحليل التفضيلات</Button>
        ) : (
          <Button onClick={handleNext} disabled={!answers[currentQuestion.id]}>التالي</Button>
        )}
      </div>
    </div>
  );
}
