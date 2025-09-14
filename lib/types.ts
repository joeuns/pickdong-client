// API 응답 타입 정의
export interface SubArea {
  sigunGuCode: string
  name: string
  subscribe: boolean
}

export interface Area {
  areaCode: string
  name: string
  subAreas: SubArea[]
}

export interface SubscriptionsResponse {
  areas: Area[]
}

// 사용자 타입: 이메일만 유지
export interface User {
  email: string
}

// 투어/축제 상세 정보 타입
export interface TourOverview {
  eventStartDate: string
  eventEndDate: string
  businessHours: string
  expectedDuration: string
  cost: string
}

export interface TourDetailInfo {
  infoName: string
  infoText: string
}

export interface TourDirections {
  roadAddress: string
  eventPlace: string
  telephone: string
}

export interface TourDetail {
  tourId: number
  title: string
  keywords: string[]
  images: string[]
  overview: TourOverview
  detailInfo: TourDetailInfo[]
  directions: TourDirections
}
