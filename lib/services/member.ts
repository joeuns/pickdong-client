import { apiClient } from '../api'

export interface MemberProfile {
  email: string
  emailSubscribe: boolean
}

export const getMemberProfile = async (): Promise<MemberProfile> => {
  const { data } = await apiClient.get<MemberProfile>('/api/member')
  return data
}

export const updateEmailSubscribe = async (
  emailSubscribe: boolean
): Promise<{ emailSubscribe: boolean }> => {
  const { data } = await apiClient.patch<{ emailSubscribe: boolean }>(
    '/api/member/email-subscribe',
    { emailSubscribe }
  )
  return data
}

export const deleteMember = async (): Promise<void> => {
  await apiClient.delete('/api/member')
}


