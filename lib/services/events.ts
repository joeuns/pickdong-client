import { apiClient } from '../api'

export interface Tour {
  tourId: number
  title: string
  startDate: string
  endDate: string
  area: string
  sigunGu: string
  mainImageUrl: string
  keywords: string[]
}

export interface MetaData {
  contentSize: number
  hasNext: boolean
}

export interface ToursResponse {
  metaData: MetaData
  tours: Tour[]
}

// 구독 지역별 축제 조회 API
export const getEventsBySubscribedAreas = async (page: number = 0): Promise<ToursResponse> => {
  try {
    const response = await apiClient.get<ToursResponse>(`/api/member/subscriptions/tours?page=${page}`)
    return response.data
  } catch (error) {
    console.error('구독 지역 축제 조회 실패:', error)
    throw error
  }
}
