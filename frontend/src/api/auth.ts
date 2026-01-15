import { http } from '@/api/http'
import { sleep, useMock } from '@/api/mock'

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  token: string
  user: {
    username: string
    displayName?: string
  }
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  if (useMock()) {
    await sleep(450)
    // mock: 任何账号都允许，建议用 admin/admin
    return {
      token: `mock_${payload.username}_${Date.now()}`,
      user: { username: payload.username, displayName: payload.username === 'admin' ? '管理员' : payload.username },
    }
  }

  const res = await http.post<LoginResponse>('/api/auth/login', payload)
  return res.data
}

