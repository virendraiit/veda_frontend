"use client"

import { useLanguage } from "@/lib/hooks/useLanguage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ExampleLanguagePage() {
  const { t, currentLanguage, changeLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-primary backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl text-white font-bold">{t("appName")}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("back")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Language System Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg mb-4">
                    Current Language: <strong>{currentLanguage}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    This page demonstrates how the language system works across all modules.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t("dynamicStorytelling")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{t("dynamicStorytellingDesc")}</p>
                      <div className="mt-4">
                        <Button size="sm" className="w-full">
                          {t("open")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t("intelligentQnA")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{t("intelligentQnADesc")}</p>
                      <div className="mt-4">
                        <Button size="sm" className="w-full">
                          {t("open")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t("sportsProgram")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{t("sportsProgramDesc")}</p>
                      <div className="mt-4">
                        <Button size="sm" className="w-full">
                          {t("open")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t("musicLearning")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{t("musicLearningDesc")}</p>
                      <div className="mt-4">
                        <Button size="sm" className="w-full">
                          {t("open")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center mt-8">
                  <h3 className="text-lg font-semibold mb-4">Common UI Elements</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="outline" size="sm">{t("save")}</Button>
                    <Button variant="outline" size="sm">{t("cancel")}</Button>
                    <Button variant="outline" size="sm">{t("edit")}</Button>
                    <Button variant="outline" size="sm">{t("delete")}</Button>
                    <Button variant="outline" size="sm">{t("search")}</Button>
                    <Button variant="outline" size="sm">{t("submit")}</Button>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <h3 className="text-lg font-semibold mb-4">Navigation Elements</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="outline" size="sm">{t("home")}</Button>
                    <Button variant="outline" size="sm">{t("dashboard")}</Button>
                    <Button variant="outline" size="sm">{t("profile")}</Button>
                    <Button variant="outline" size="sm">{t("settings")}</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 