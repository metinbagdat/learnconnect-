import React from 'react';

interface BilingualTextProps {
  text: string;
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
}

export const BilingualText: React.FC<BilingualTextProps> = ({ 
  text, 
  className = "",
  primaryClassName = "",
  secondaryClassName = "text-sm opacity-60"
}) => {
  // Check if text contains bilingual separator
  if (!text.includes(' – ')) {
    return <span className={className}>{text}</span>;
  }

  // Split the text at the bilingual separator
  const [primary, secondary] = text.split(' – ');

  return (
    <span className={className}>
      <span className={primaryClassName}>{primary}</span>
      {secondary && (
        <>
          <span className="opacity-40 mx-1">–</span>
          <span className={`${secondaryClassName} ml-1`}>{secondary}</span>
        </>
      )}
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