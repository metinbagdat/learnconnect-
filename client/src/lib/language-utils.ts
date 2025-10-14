import type { Language } from '@/contexts/consolidated-language-context';

export interface LocalizedContent {
  titleEn?: string;
  titleTr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
  contentEn?: string;
  contentTr?: string;
}

export function getLocalizedField<T extends LocalizedContent>(
  content: T,
  field: 'title' | 'description' | 'content',
  language: Language,
  fallbackLanguage: Language = 'en'
): string {
  const enField = `${field}En` as keyof T;
  const trField = `${field}Tr` as keyof T;
  
  const primaryValue = language === 'tr' ? content[trField] : content[enField];
  const fallbackValue = fallbackLanguage === 'tr' ? content[trField] : content[enField];
  
  const value = (primaryValue as string) || (fallbackValue as string) || '';
  
  return value || '';
}

export function useLocalizedContent() {
  const getTitle = (content: LocalizedContent, language: Language) => 
    getLocalizedField(content, 'title', language);
  
  const getDescription = (content: LocalizedContent, language: Language) => 
    getLocalizedField(content, 'description', language);
  
  const getContent = (content: LocalizedContent, language: Language) => 
    getLocalizedField(content, 'content', language);
  
  return { getTitle, getDescription, getContent, getLocalizedField };
}
