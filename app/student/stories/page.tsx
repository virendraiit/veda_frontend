"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function StoriesRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/student/storytelling")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Storytelling...</p>
      </div>
    </div>
  )
} 