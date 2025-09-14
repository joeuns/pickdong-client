"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

interface HeaderProps {
  showMyPageButton?: boolean
  showHomeButton?: boolean
  showLoginButton?: boolean
}

export function Header({ 
  showMyPageButton = false, 
  showHomeButton = false, 
  showLoginButton = false 
}: HeaderProps) {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="/pickdong-logo.png" alt="픽동" className="w-8 h-8" />
            </div>
            <span className="text-xl font-bold text-foreground">픽동</span>
          </button>
          
          <div className="flex items-center space-x-4">
            {showHomeButton && (
              <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                홈으로
              </Button>
            )}
            {showMyPageButton && user && (
              <Button variant="outline" size="sm" onClick={() => router.push("/mypage")}>
                마이페이지
              </Button>
            )}
            {showLoginButton && !user && (
              <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
