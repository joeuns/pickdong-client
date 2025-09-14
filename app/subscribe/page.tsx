"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Plus, Check } from "lucide-react"
import { Header } from "@/components/header"

// Seoul districts data
const seoulDistricts = [
  "강남구",
  "강동구",
  "강북구",
  "강서구",
  "관악구",
  "광진구",
  "구로구",
  "금천구",
  "노원구",
  "도봉구",
  "동대문구",
  "동작구",
  "마포구",
  "서대문구",
  "서초구",
  "성동구",
  "성북구",
  "송파구",
  "양천구",
  "영등포구",
  "용산구",
  "은평구",
  "종로구",
  "중구",
  "중랑구",
]

// Other cities data
const otherCities = {
  부산: [
    "중구",
    "서구",
    "동구",
    "영도구",
    "부산진구",
    "동래구",
    "남구",
    "북구",
    "해운대구",
    "사하구",
    "금정구",
    "강서구",
    "연제구",
    "수영구",
    "사상구",
    "기장군",
  ],
  대구: ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군"],
  인천: ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
  광주: ["동구", "서구", "남구", "북구", "광산구"],
  대전: ["동구", "중구", "서구", "유성구", "대덕구"],
  울산: ["중구", "남구", "동구", "북구", "울주군"],
}

export default function SubscribePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [subscribedRegions, setSubscribedRegions] = useState<{ [key: string]: string[] }>({
    서울: ["광진구", "용산구"],
    대구: ["달서구"],
  })
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const handleSubscribe = (city: string, district: string) => {
    setSubscribedRegions((prev) => {
      const newRegions = { ...prev }
      if (!newRegions[city]) {
        newRegions[city] = []
      }
      if (!newRegions[city].includes(district)) {
        newRegions[city] = [...newRegions[city], district]
      }
      return newRegions
    })
  }

  const handleUnsubscribe = (city: string, district: string) => {
    setSubscribedRegions((prev) => {
      const newRegions = { ...prev }
      if (newRegions[city]) {
        newRegions[city] = newRegions[city].filter((d) => d !== district)
        if (newRegions[city].length === 0) {
          delete newRegions[city]
        }
      }
      return newRegions
    })
  }

  const isSubscribed = (city: string, district: string) => {
    return subscribedRegions[city]?.includes(district) || false
  }

  const filteredSeoulDistricts = seoulDistricts.filter((district) =>
    district.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredOtherCities = Object.entries(otherCities).filter(
    ([city, districts]) =>
      city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      districts.some((district) => district.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getSubscribedCount = () => {
    return Object.values(subscribedRegions).reduce((total, districts) => total + districts.length, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showHomeButton={true} showMyPageButton={true} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">지역 구독 관리</h1>
          <p className="text-lg text-muted-foreground mb-6">
            관심있는 지역을 구독하고 해당 지역의 축제와 행사 소식을 받아보세요
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              현재 구독 중: {getSubscribedCount()}개 지역
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="지역명을 검색하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Subscriptions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-primary" />
                  구독 중인 지역
                </CardTitle>
                <CardDescription>현재 {getSubscribedCount()}개 지역을 구독하고 있습니다</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(subscribedRegions).length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">구독 중인 지역이 없습니다</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(subscribedRegions).map(([city, districts]) => (
                      <div key={city} className="space-y-2">
                        <h4 className="font-semibold text-foreground">{city}</h4>
                        <div className="flex flex-wrap gap-2">
                          {districts.map((district) => (
                            <Button
                              key={district}
                              variant="secondary"
                              size="sm"
                              onClick={() => handleUnsubscribe(city, district)}
                              className="h-7 px-2 text-xs bg-primary/10 text-primary hover:bg-destructive hover:text-destructive-foreground"
                            >
                              {district}
                              <span className="ml-1">×</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Available Regions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seoul */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>서울특별시</span>
                  <Badge variant="outline">{filteredSeoulDistricts.length}개 구</Badge>
                </CardTitle>
                <CardDescription>서울시 전체 자치구에서 열리는 다양한 행사를 만나보세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredSeoulDistricts.map((district) => (
                    <Button
                      key={district}
                      variant={isSubscribed("서울", district) ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        isSubscribed("서울", district)
                          ? handleUnsubscribe("서울", district)
                          : handleSubscribe("서울", district)
                      }
                      className="h-9 text-sm justify-start bg-transparent"
                    >
                      {isSubscribed("서울", district) ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      {district}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Other Cities */}
            {filteredOtherCities.map(([city, districts]) => (
              <Card key={city}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{city}광역시</span>
                    <Badge variant="outline">{districts.length}개 구/군</Badge>
                  </CardTitle>
                  <CardDescription>{city}에서 열리는 지역 축제와 문화 행사를 확인하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {districts
                      .filter(
                        (district) =>
                          searchTerm === "" ||
                          district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          city.toLowerCase().includes(searchTerm.toLowerCase()),
                      )
                      .map((district) => (
                        <Button
                          key={district}
                          variant={isSubscribed(city, district) ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            isSubscribed(city, district)
                              ? handleUnsubscribe(city, district)
                              : handleSubscribe(city, district)
                          }
                          className="h-9 text-sm justify-start bg-transparent"
                        >
                          {isSubscribed(city, district) ? (
                            <Check className="w-4 h-4 mr-2" />
                          ) : (
                            <Plus className="w-4 h-4 mr-2" />
                          )}
                          {district}
                        </Button>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-8">
          <Button size="lg" className="px-8">
            구독 설정 저장하기
          </Button>
        </div>
      </div>
    </div>
  )
}
