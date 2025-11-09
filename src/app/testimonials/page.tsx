import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddTestimonialForm from "@/components/Forms/AddTestimonialForm";

export default function TestimonialsPage() {

  return (
    <div className="container mx-auto px-4 md:px-16 py-20">
      <Card className="max-w-2xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary text-center">
            إضافة رأي طالب جديد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddTestimonialForm />
        </CardContent>
      </Card>
    </div>
  );
}
