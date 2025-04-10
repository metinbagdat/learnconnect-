import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, BookOpen, GraduationCap } from "lucide-react";

export function AddTurkishCourses() {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  
  const addCoursesMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/add-turkish-courses");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Turkish university entrance exam courses added successfully!",
      });
      setIsAdding(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add Turkish courses: ${error.message}`,
        variant: "destructive",
      });
      setIsAdding(false);
    }
  });
  
  const handleAddCourses = () => {
    setIsAdding(true);
    addCoursesMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="mr-2 h-5 w-5" />
          Turkish University Entrance Exam (YKS) Courses
        </CardTitle>
        <CardDescription>
          Add specialized courses for Turkish university entrance exams to the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>This will add the following specialized course categories:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>TYT (Basic Proficiency Test) Courses</li>
            <li>AYT (Field Qualification Test) Courses</li>
            <li>YDT (Foreign Language Test) Courses</li>
            <li>YKS Preparation and Strategy Courses</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            These courses are specifically designed for students preparing for the Turkish university entrance examination system.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAddCourses}
          disabled={isAdding || addCoursesMutation.isPending}
          className="w-full"
        >
          {isAdding || addCoursesMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Courses...
            </>
          ) : (
            <>
              <BookOpen className="mr-2 h-4 w-4" />
              Add Turkish Exam Courses
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}