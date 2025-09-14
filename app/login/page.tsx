"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const getGoogleOAuthUrl = () => {
    const base = "https://accounts.google.com/o/oauth2/auth"
    const params = new URLSearchParams({
      client_id: "481051508755-f5h7kkq5r1m8i2t87vta31d29biam08t.apps.googleusercontent.com",
      redirect_uri: "https://api.pickdong.com/api/login/oauth/google",
      response_type: "code",
      scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    })
    return `${base}?${params.toString()}`
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      // Redirect to Google OAuth
      window.location.href = getGoogleOAuthUrl()
      return
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-start justify-center p-4 pt-12 sm:items-center sm:pt-0">
  <div className="w-full max-w-md">
    {/* Logo and Title */}
    <div className="text-center mb-6">
      <div className="w-24 h-32 sm:w-40 sm:h-40 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <img src="/pickdong-logo.png" alt="픽동" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">픽동에 오신 것을 환영합니다</h1>
      <p className="text-muted-foreground text-sm sm:text-base">
        관심있는 동네를 구독하고 재밌는 축제를 발견해보세요
      </p>
    </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">로그인</CardTitle>
            <CardDescription>소셜 계정으로 간편하게 시작하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error message from callback */}
            {searchParams.get("error") && (
              <div className="text-sm rounded-md border border-destructive/30 bg-destructive/10 text-destructive px-3 py-2">
                로그인에 실패했습니다. 사유: {searchParams.get("error")}
              </div>
            )}

            {/* Google Login */}
            <Button
              size="lg"
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-3"></div>
                  로그인 중...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 5.793-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  구글로 시작하기
                </>
              )}
            </Button>

            {/* Kakao removed */}

            {/* Footer */}
            <div className="text-center mt-6 text-sm text-muted-foreground">
              <p>
                픽동은 이메일링을 위해 사용자의{" "}
                <span className="bg-primary/20 text-primary px-1 py-0.5 rounded font-medium">이메일</span>
                주소만 수집합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
