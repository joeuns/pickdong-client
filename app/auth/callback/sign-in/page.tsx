"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getMemberProfile } from "@/lib/services/member"

export default function AuthCallbackSignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      router.replace("/login")
      return
    }

    ;(async () => {
      try {
        // Save JWT for API calls
        localStorage.setItem("pickdong_token", token)

        // Fetch member profile immediately and persist minimal info for UI guards
        const profile = await getMemberProfile()
        localStorage.setItem("pickdong_user", JSON.stringify({ email: profile.email }))

        // Redirect to mypage after successful login
        window.location.replace("/mypage")
      } catch (e) {
        // Fallback to login on any error
        router.replace("/login")
      }
    })()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm text-muted-foreground">로그인 처리 중...</div>
    </div>
  )
}


