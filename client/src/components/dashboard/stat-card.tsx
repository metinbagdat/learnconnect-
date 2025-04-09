import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type StatColor = "primary" | "success" | "warning" | "secondary";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string;
  color: StatColor;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  color
}: StatCardProps) {
  const getColorClasses = (color: StatColor) => {
    switch (color) {
      case "primary":
        return "bg-primary-100 text-primary";
      case "success":
        return "bg-success bg-opacity-10 text-success";
      case "warning":
        return "bg-warning bg-opacity-10 text-warning";
      case "secondary":
        return "bg-secondary-500 bg-opacity-10 text-secondary-500";
      default:
        return "bg-primary-100 text-primary";
    }
  };

  return (
    <Card className="overflow-hidden shadow">
      <CardContent className="p-0">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className={`flex-shrink-0 rounded-md p-3 ${getColorClasses(color)}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="text-sm font-medium text-neutral-500">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-neutral-900">{value}</div>
              </dd>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
