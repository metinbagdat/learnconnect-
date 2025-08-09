import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";

interface SuggestionSelectProps {
  type: "goals" | "fields" | "courseTopics" | "timeframes";
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function SuggestionSelect({
  type,
  label,
  placeholder = "Select an option",
  value,
  onChange,
  required = false,
}: SuggestionSelectProps) {
  const { language, t } = useLanguage();
  
  // Fetch suggestions from the API with language support
  const { data: suggestions = [], isLoading } = useQuery<string[]>({
    queryKey: [`/api/suggestions?type=${type}&language=${language}`],
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 py-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">{t('loadingSuggestions', 'Loading suggestions...')}</span>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {suggestions.map((suggestion) => (
            <SelectItem key={suggestion} value={suggestion}>
              {suggestion}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

// Autocomplete version with search capability
export function SuggestionAutocomplete({
  type,
  label,
  placeholder = "Search or select an option",
  value,
  onChange,
  required = false,
}: SuggestionSelectProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { language, t } = useLanguage();
  
  // Fetch suggestions from the API with language support
  const { data: suggestions = [], isLoading } = useQuery<string[]>({
    queryKey: [`/api/suggestions?type=${type}&query=${query}&language=${language}`],
    enabled: true,
  });

  return (
    <div className="relative w-full">
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <input
        type="text"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        value={value}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        required={required}
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      )}
      
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-popover shadow-md">
          <ul className="py-1 max-h-60 overflow-auto">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  onChange(suggestion);
                  setIsOpen(false);
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}