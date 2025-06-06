
"use client";

import { useLanguage, supportedLanguages } from '@/contexts/language-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { selectedLanguage, setSelectedLanguage, getLanguageName } = useLanguage();

  const handleLanguageChange = (newLangCode: string) => {
    setSelectedLanguage(newLangCode);
  };

  return (
    <div className="p-2 mt-auto">
      <label htmlFor="language-select" className="sr-only">Select Language</label>
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger id="language-select" className="w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:p-2">
           <Globe className="mr-0 group-data-[state=expanded]:mr-2 transition-all group-data-[collapsible=icon]:mr-0" size={18} />
           <span className="group-data-[collapsible=icon]:hidden">
            <SelectValue placeholder="Select language">
              {getLanguageName(selectedLanguage) || selectedLanguage.toUpperCase()}
            </SelectValue>
           </span>
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
