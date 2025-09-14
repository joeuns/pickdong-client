import axios from 'axios'

// API 기본 설정
// 환경 변수(NEXT_PUBLIC_API_BASE_URL)만 사용하도록 단순화
const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl
  }
  // 환경 변수가 없으면 상대 경로 사용 (Next.js 프록시 또는 동일 오리진)
  return ''
}

const API_BASE_URL = getApiBaseUrl()

// axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 (토큰 추가 등)
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰 가져와서 헤더에 추가
    const token = localStorage.getItem('pickdong_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 시 로그아웃 처리
      localStorage.removeItem('pickdong_token')
      localStorage.removeItem('pickdong_user')
      window.location.href = '/auth/session-expired'
    }
    return Promise.reject(error)
  }
)
