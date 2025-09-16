import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Bell } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header showLoginButton={true} showMyPageButton={true} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              관심있는 동네를 고르면,
              <br />
              <span className="text-primary">동네 축제를 픽해드려요</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              바쁜 일상을 보내느라 주말에 뭐 할지 고민하셨나요?
              <br />
              픽동과 함께 우리 동네 재밌는 행사를 놓치지 마세요!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="w-full sm:w-auto bg-white" asChild>
              <Link href="/login">
                <svg
                  className="w-5 h-5 mr-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
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
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">지역 선택</h3>
              <p className="text-sm text-muted-foreground">
                관심있는 동네를 구독하세요
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">메일 받기</h3>
              <p className="text-sm text-muted-foreground">
                새로운 축제 소식을 받아보세요
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">참여하기</h3>
              <p className="text-sm text-muted-foreground">
                놓치지 말고 축제를 즐기세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Introduction */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              픽동이 제공하는 서비스
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              구독한 지역에서 열리는 다양한 축제와 행사 정보를 한눈에 확인하고,
              놓치지 않도록 메일을 받아보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-4">맞춤형 지역 구독</h3>
              <p className="text-muted-foreground mb-6">
                서울 광진구, 용산구 등 관심있는 지역을 선택하면, 해당 지역에서
                열리는 모든 축제와 행사 정보를 받아볼 수 있습니다.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>대한민국 전 자치구 지원</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>실시간 행사 정보 업데이트</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>이메일 및 앱 알림 지원(추후 예정)</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-12 h-12 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">전국 모든 지역</h4>
              <p className="text-3xl font-bold text-primary mb-2">구독 가능</p>
              <p className="text-sm text-muted-foreground">
                대한민국 전체 지원
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
