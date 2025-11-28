import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Briefcase } from "lucide-react";

export function ParameterSummary({ data }: { data: any }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {/* Learner Parameters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" />
            Learner Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>Age:</strong> {data.demographics?.age}</div>
          <div><strong>Profession:</strong> {data.demographics?.profession}</div>
          <div><strong>Bloom's Level:</strong> <Badge>{data.bloomsLevel}</Badge></div>
          <div><strong>Prerequisites:</strong> {data.prerequisites?.length || 0} items</div>
        </CardContent>
      </Card>

      {/* Content Parameters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Content Design
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>Module Length:</strong> <Badge variant="secondary">{data.modularity}</Badge></div>
          <div><strong>Modalities:</strong> {data.learningModalities?.length || 0}</div>
          <div><strong>Pedagogical Approaches:</strong> {data.pedagogicalApproach?.length || 0}</div>
          <div><strong>Feedback:</strong> {data.feedbackMechanism}</div>
        </CardContent>
      </Card>

      {/* Business Parameters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Business Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>Dev Time:</strong> {data.developmentTime} weeks</div>
          <div><strong>Budget:</strong> ${data.budget?.toLocaleString()}</div>
          <div><strong>Update Cadence:</strong> {data.updateCadence}</div>
          <div><strong>Content Vetting:</strong> {data.contentVetting}</div>
        </CardContent>
      </Card>
    </div>
  );
}
