"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, DollarSign, Share2, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getTourDetail } from "@/lib/services/tour"
import { TourDetail } from "@/lib/types"
import { Header } from "@/components/header"


export default function EventDetailPage() {
  const params = useParams()
  const tourId = parseInt(params.id as string)
  
  const [tourData, setTourData] = useState<TourDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // API에서 투어 상세 정보 조회
  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getTourDetail(tourId)
        setTourData(data)
      } catch (err) {
        console.error('투어 상세 정보 조회 실패:', err)
        setError('투어 정보를 불러오는데 실패했습니다.')
        toast({
          title: "오류 발생",
          description: "투어 정보를 불러오는데 실패했습니다. 다시 시도해주세요.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (tourId) {
      fetchTourDetail()
    }
  }, [tourId, toast])

  const nextImage = () => {
    if (tourData?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % tourData.images.length)
    }
  }

  const prevImage = () => {
    if (tourData?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + tourData.images.length) % tourData.images.length)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast({
        title: "링크가 복사되었습니다",
        description: "다른 사람들과 이 행사를 공유해보세요!",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    }
  }

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">투어 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error || !tourData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">투어 정보를 불러올 수 없습니다</h2>
          <p className="text-muted-foreground mb-4">{error || '투어 정보가 없습니다.'}</p>
          <Button onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showMyPageButton={true} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{tourData.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {tourData.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Image Carousel */}
        <div className="mb-8">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={
                tourData.images[currentImageIndex] ||
                "/placeholder.svg?height=400&width=800&query=tour image" ||
                "/placeholder.svg"
              }
              alt={`${tourData.title} 이미지 ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Carousel Controls */}
            {tourData.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {tourData.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">행사 개요</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">진행 기간</p>
                      <p className="text-sm text-muted-foreground">
                        {tourData.overview.eventStartDate} ~ {tourData.overview.eventEndDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">운영 시간</p>
                      <p className="text-sm text-muted-foreground">{tourData.overview.businessHours}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">예상 소요시간</p>
                      <p className="text-sm text-muted-foreground">{tourData.overview.expectedDuration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">비용</p>
                      <p className="text-sm text-muted-foreground">{tourData.overview.cost}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">행사 상세 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tourData.detailInfo.map((info, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center">
                      <span className="font-medium text-foreground min-w-[100px] mb-1 sm:mb-0">{info.infoName}:</span>
                      <span className="text-muted-foreground">{info.infoText}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">오시는 길</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">주소</p>
                      <p className="text-muted-foreground">{tourData.directions.roadAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">세부 장소</p>
                      <p className="text-muted-foreground">{tourData.directions.eventPlace}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium">연락처</p>
                      <p className="text-muted-foreground">{tourData.directions.telephone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share Button */}
            <Card>
              <CardContent className="p-6">
                <Button
                  onClick={handleShare}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      복사됨!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5 mr-2" />
                      공유하기
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
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
              관심있는 동네를 고르면, 그 동네에서 열리는 축제를 픽해드려요. 우리 동네 재밌는 행사를 놓치지 마세요!
            </p>
            <p className="text-sm text-muted-foreground">&copy; 2025 픽동. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
