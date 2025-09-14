import { apiClient } from '../api'
import { SubscriptionsResponse } from '../types'

// 구독 정보 조회 API
export const getSubscriptions = async (): Promise<SubscriptionsResponse> => {
  try {
    const response = await apiClient.get<SubscriptionsResponse>('/api/member/subscriptions')
    return response.data
  } catch (error) {
    console.error('구독 정보 조회 실패:', error)
    throw error
  }
}

// 구독 상태 변경 API
export const updateSubscription = async (
  areaCode: string,
  sigunGuCode: string, 
  subscribe: boolean
): Promise<void> => {
  try {
    await apiClient.put('/api/member/subscriptions', {
      areaCode,
      sigunGuCode,
      subscribe
    })
  } catch (error) {
    console.error('구독 상태 변경 실패:', error)
    throw error
  }
}
