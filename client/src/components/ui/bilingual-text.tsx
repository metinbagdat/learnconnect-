import React from 'react';

interface BilingualTextProps {
  text: string;
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  compact?: boolean; // For constrained spaces like tabs/buttons
  truncate?: boolean; // For very limited space
}

export const BilingualText: React.FC<BilingualTextProps> = ({ 
  text, 
  className = "",
  primaryClassName = "",
  secondaryClassName = "text-sm opacity-60",
  compact = false,
  truncate = false
}) => {
  // Check if text contains bilingual separator
  if (!text.includes(' – ')) {
    const finalClassName = truncate ? `${className} truncate max-w-full` : className;
    return <span className={finalClassName}>{text}</span>;
  }

  // Split the text at the bilingual separator
  const [primary, secondary] = text.split(' – ');

  // Compact mode for tabs, buttons, and constrained spaces
  if (compact) {
    return (
      <span className={`${className} flex items-center gap-1 min-w-0`} title={`${primary} – ${secondary}`}>
        <span className={`${primaryClassName} truncate`}>{primary}</span>
        <span className="opacity-30 text-xs shrink-0">•</span>
        <span className={`${secondaryClassName} text-xs opacity-50 truncate`}>{secondary}</span>
      </span>
    );
  }

  // Truncate mode for very limited space
  if (truncate) {
    return (
      <span className={`${className} block truncate max-w-full`} title={`${primary} – ${secondary}`}>
        <span className={primaryClassName}>{primary}</span>
        <span className="opacity-40 mx-1">–</span>
        <span className={`${secondaryClassName} ml-1`}>{secondary}</span>
      </span>
    );
  }

  // Default mode with responsive design
  return (
    <span className={`${className} inline-flex flex-wrap items-center gap-1`}>
      <span className={primaryClassName}>{primary}</span>
      <span className="opacity-40 shrink-0">–</span>
      <span className={`${secondaryClassName} break-words`}>{secondary}</span>
    </span>
  );
};

// Helper hook to use bilingual text with automatic styling
export const useBilingualText = () => {
  const formatBilingual = (text: string, options?: {
    primaryClassName?: string;
    secondaryClassName?: string;
  }) => {
    return (
      <BilingualText
        text={text}
        primaryClassName={options?.primaryClassName}
        secondaryClassName={options?.secondaryClassName || "text-sm opacity-60"}
      />
    );
  };

  return { formatBilingual, BilingualText };
};