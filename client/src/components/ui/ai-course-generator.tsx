import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const generatorSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  targetAudience: z.string().optional(),
  specificFocus: z.string().optional(),
});

type GeneratorValues = z.infer<typeof generatorSchema>;

export function AICourseGenerator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);

  const form = useForm<GeneratorValues>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      topic: "",
      level: "Beginner",
      targetAudience: "",
      specificFocus: "",
    },
  });

  const courseGeneration = useMutation({
    mutationFn: async (data: GeneratorValues) => {
      const res = await apiRequest("POST", "/api/ai/generate-course", data);
      const result = await res.json();
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Course generated",
        description: "Your AI-generated course is ready",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/ai/courses"] });
      setGeneratedCourse(data.course);
    },
    onError: (error) => {
      toast({
        title: "Failed to generate course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: GeneratorValues) {
    courseGeneration.mutate(data);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Course Generator</CardTitle>
          <CardDescription>
            Provide a topic and let AI generate a comprehensive course structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Topic</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Advanced JavaScript Patterns" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Web developers, College students" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specificFocus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specific Focus (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any specific areas or concepts to focus on" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={courseGeneration.isPending}
              >
                {courseGeneration.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Course...
                  </>
                ) : (
                  "Generate Course"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {generatedCourse && (
        <Card>
          <CardHeader>
            <CardTitle>{generatedCourse.title}</CardTitle>
            <CardDescription>AI-generated Course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Description:</span>
                <p>{generatedCourse.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Category:</span>
                  <p>{generatedCourse.category}</p>
                </div>
                <div>
                  <span className="font-semibold">Level:</span>
                  <p>{generatedCourse.level || "Not specified"}</p>
                </div>
                <div>
                  <span className="font-semibold">Modules:</span>
                  <p>{generatedCourse.moduleCount}</p>
                </div>
                <div>
                  <span className="font-semibold">Duration:</span>
                  <p>{generatedCourse.durationHours} hours</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => window.location.href = `/courses/${generatedCourse.id}`}
              className="w-full"
            >
              View Course
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}