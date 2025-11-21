import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  image?: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Ayşe Yılmaz",
    role: "TYT Student - 95th Percentile",
    text: "EduLearn's AI-powered study plans transformed my exam prep. The personalized curriculum and daily tasks made studying efficient and focused.",
    rating: 5
  },
  {
    name: "İbrahim Arslan",
    role: "Business Development Learner",
    text: "The bilingual content and expert mentorship helped me master new skills quickly. The gamification features keep me motivated every day!",
    rating: 5
  },
  {
    name: "Maria Kowalski",
    role: "STEM Course Student",
    text: "Crystal-clear lessons with real-world applications. The interactive challenges and progress tracking make learning engaging and measurable.",
    rating: 5
  },
  {
    name: "Chen Wei",
    role: "Professional Reskiller",
    text: "The adaptive learning system adjusts to my pace perfectly. Within 3 months, I completed my professional certification with confidence.",
    rating: 5
  }
];

export function StudentTestimonials() {
  return (
    <section className="py-12 px-4 md:px-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-xl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Trusted by Thousands of Learners
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our global community of successful students and professionals who've transformed their learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    </div>
                    <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 mb-3">
                  <Quote className="h-5 w-5 text-blue-500 flex-shrink-0" />
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  "{testimonial.text}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
            <p className="text-muted-foreground">Active Learners</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">4.9★</div>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">92%</div>
            <p className="text-muted-foreground">Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
