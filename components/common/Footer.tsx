"use client"

import { useLanguage } from "@/lib/hooks/useLanguage"
import Image from "next/image"

export const Footer: React.FC = () => {
  const { t } = useLanguage()

  return (
    <footer className="bg-primary text-white py-8 px-4">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-16 h-16 flex items-center justify-center">
            <Image src="/logo_small.png" alt="Veda-Shikshak Sahachar" width={64} height={64} />
          </div>
          <span className="text-xl font-bold">{t("appName")}</span>
        </div>
        <p className="text-gray-400 mb-4">{t("completeAIEcosystem")}</p>
        <div className="flex justify-center space-x-6 text-sm text-gray-400">
          <span>{t("poweredBy")}</span>
          <span>•</span>
          <span>{t("audioAIIntegration")}</span>
          <span>•</span>
          <span>{t("multiLanguageSupport")}</span>
          <span>•</span>
          <span>{t("sportsMusicPrograms")}</span>
        </div>
      </div>
    </footer>
  )
} 