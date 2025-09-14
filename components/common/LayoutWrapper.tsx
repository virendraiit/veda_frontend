"use client"

import { Header, HeaderProps } from "./Header"
import { Footer } from "./Footer"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface LayoutWrapperProps extends HeaderProps {
  children: React.ReactNode
  showFooter?: boolean
  className?: string
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  children,
  showFooter = true,
  className = "",
  ...headerProps
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 ${className}`}>
      <Header {...headerProps} />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
      
      {/* Sticky Google Cloud Logo */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-sm flex items-center justify-center overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold" style={{
                background: 'linear-gradient(45deg, #4285F4 0%, #EA4335 25%, #FBBC05 50%, #34A853 75%)'
              }}>
                G
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-800 leading-tight">Google</span>
              <span className="text-xs text-gray-600 leading-tight">Cloud</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 