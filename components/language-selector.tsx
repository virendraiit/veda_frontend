"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Languages } from "lucide-react"
import { useLanguage } from "@/lib/hooks/useLanguage"

export function LanguageSelector() {
  const { currentLanguage, availableLanguages, changeLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <Languages className="w-4 h-4 text-white" />
      <Select value={currentLanguage} onValueChange={changeLanguage}>
        <SelectTrigger className="w-40 h-9 border border-border shadow-none focus:ring-primary focus:ring-2 focus:ring-offset-2">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              <div className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
