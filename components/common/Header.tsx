"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/hooks/useLanguage"
import { useAuthContext } from "@/components/providers/AuthProvider"

export interface HeaderProps {
  title?: string
  subtitle?: string
  showLoginButton?: boolean
  logoHref?: string
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showLoginButton = true,
  logoHref = "/"
}) => {
  const { t } = useLanguage()
  const { isAuthenticated, user, logout } = useAuthContext()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="border-b bg-primary backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={logoHref} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-30 h-10 flex items-center justify-center" style={{ width: '!6.5rem' }}>
                <Image src="/logo_small.png" alt="Veda-Shikshak Sahachar" width={140} height={140} />
              </div>
              <div style={{ marginLeft: '-10px' }}>
                <h1 className="text-2xl text-white font-bold">
                  {title || t("appName")}
                </h1>
                <p className="text-sm text-white">
                  {subtitle || t("appSubtitle")}
                </p>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {/* <Button variant="outline" size="sm"  disabled>
                {user?.email}
              </Button> */}
            </div>
            <LanguageSelector />
            {showLoginButton && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <User className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      {t("login")}
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 