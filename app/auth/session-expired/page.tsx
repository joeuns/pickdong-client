// app/auth/session-expired/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SessionExpiredPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/") // 메인 페이지로 이동
    }, 2000) // 2초 후 이동

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-6">
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          로그아웃되었습니다
        </h1>
        <p className="text-muted-foreground mb-2">
          세션이 만료되어 자동으로 로그아웃 처리되었습니다.
        </p>
        <p className="text-muted-foreground">
          잠시 후 메인 페이지로 이동합니다…
        </p>
      </div>
    </div>
  )
}