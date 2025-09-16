"use client";

export function Footer() {
  return (
    <footer className="bg-card py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="/pickdong-logo.png" alt="픽동" className="w-8 h-8" />
            </div>
            <span className="text-xl font-bold">픽동</span>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            관심있는 동네를 고르면, 그 동네에서 열리는 축제를 픽해드려요. 우리
            동네 재밌는 행사를 놓치지 마세요!
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; 2025 픽동. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
