import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function EnrollmentTest() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleEnroll = async (courseId: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/pipeline/enroll-and-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) throw new Error("Enrollment failed");

      const data = await response.json();
      setResult(data.data);
      toast({ title: "✓ Enrollment successful!" });
    } catch (error) {
      toast({ 
        title: "Enrollment failed", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Pipeline Test</CardTitle>
          <CardDescription>Test the 5-step enrollment process</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => handleEnroll(1)}
            disabled={loading}
            data-testid="button-test-enrollment"
          >
            {loading ? "Processing..." : "Test Enrollment (Course 1)"}
          </Button>

          {result && (
            <div className="p-4 bg-green-50 rounded space-y-2">
              <p className="font-semibold">Enrollment Pipeline Results:</p>
              <p>✅ Step 1: Enrollment created (ID: {result.enrollment?.id})</p>
              <p>✅ Step 2: Curriculum loaded (ID: {result.curriculum?.id})</p>
              <p>✅ Step 3: Study plan created (ID: {result.studyPlan?.id})</p>
              <p>✅ Step 4: {result.assignments?.length} assignments generated</p>
              <p>✅ Step 5: {result.notifications?.length} welcome notifications sent</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
