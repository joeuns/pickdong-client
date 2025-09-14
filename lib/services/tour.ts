import { apiClient } from '../api'
import { TourDetail } from '../types'

// 투어/축제 상세 정보 조회 API
export const getTourDetail = async (tourId: number): Promise<TourDetail> => {
  try {
    const response = await apiClient.get<TourDetail>(`/api/tours/${tourId}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('투어 상세 정보 조회 실패:', error)
    throw error
  }
}
