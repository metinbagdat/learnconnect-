import React from "react";
import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  value: number;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent" | "success" | "warning" | "error";
  showLabel?: boolean;
  className?: string;
}

export function ProgressCircle({
  value,
  size = "md",
  color = "primary",
  showLabel = true,
  className
}: ProgressCircleProps) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };
  
  const colorMap = {
    primary: "text-primary",
    secondary: "text-secondary-500",
    accent: "text-accent-500",
    success: "text-success",
    warning: "text-warning",
    error: "text-error"
  };
  
  const fontSizeMap = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm"
  };

  return (
    <div className={cn("relative", sizeMap[size], className)}>
      <svg
        className="circular-progress -rotate-90"
        viewBox="0 0 36 36"
        width="100%"
        height="100%"
      >
        <circle
          className="text-neutral-200"
          strokeWidth="3"
          stroke="currentColor"
          fill="none"
          cx="18"
          cy="18"
          r={radius}
        />
        <circle
          className={colorMap[color]}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          cx="18"
          cy="18"
          r={radius}
        />
      </svg>
      {showLabel && (
        <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${fontSizeMap[size]} font-medium text-white`}>
          {progress}%
        </span>
      )}
    </div>
  );
}
