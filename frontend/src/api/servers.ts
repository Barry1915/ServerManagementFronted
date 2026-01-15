import dayjs from 'dayjs'
import { http } from '@/api/http'
import { mockGetServers, mockSaveServers, mockMetrics, sleep, useMock } from '@/api/mock'
import type { Server, ServerMetricsPoint, ServerStatus } from '@/types/server'

export type ListServersParams = {
  q?: string
  status?: ServerStatus | 'all'
}

export async function listServers(params: ListServersParams = {}): Promise<Server[]> {
  if (useMock()) {
    await sleep(300)
    const servers = mockGetServers()
    const q = (params.q || '').trim().toLowerCase()
    const status = params.status || 'all'
    return servers.filter((s) => {
      const matchQ = !q || [s.name, s.host, s.id].some((x) => String(x).toLowerCase().includes(q))
      const matchStatus = status === 'all' || s.status === status
      return matchQ && matchStatus
    })
  }

  const res = await http.get<Server[]>('/api/servers', { params })
  return res.data
}

export async function getServer(id: string): Promise<Server> {
  if (useMock()) {
    await sleep(220)
    const server = mockGetServers().find((s) => s.id === id)
    if (!server) throw new Error('服务器不存在')
    return server
  }

  const res = await http.get<Server>(`/api/servers/${encodeURIComponent(id)}`)
  return res.data
}

export type UpsertServerPayload = Pick<Server, 'name' | 'host' | 'port' | 'username' | 'tags'> & {
  status?: ServerStatus
}

export async function createServer(payload: UpsertServerPayload): Promise<Server> {
  if (useMock()) {
    await sleep(350)
    const servers = mockGetServers()
    const now = dayjs().toISOString()
    const created: Server = {
      id: `srv-${Math.random().toString(16).slice(2, 8)}`,
      name: payload.name,
      host: payload.host,
      port: payload.port,
      username: payload.username,
      tags: payload.tags || [],
      status: payload.status || 'unknown',
      createdAt: now,
      updatedAt: now,
    }
    servers.unshift(created)
    mockSaveServers(servers)
    return created
  }

  const res = await http.post<Server>('/api/servers', payload)
  return res.data
}

export async function updateServer(id: string, payload: UpsertServerPayload): Promise<Server> {
  if (useMock()) {
    await sleep(350)
    const servers = mockGetServers()
    const idx = servers.findIndex((s) => s.id === id)
    if (idx < 0) throw new Error('服务器不存在')
    const now = dayjs().toISOString()
    const current = servers[idx]!
    const updated: Server = {
      ...current,
      ...payload,
      tags: payload.tags || [],
      updatedAt: now,
    }
    servers[idx] = updated
    mockSaveServers(servers)
    return updated
  }

  const res = await http.put<Server>(`/api/servers/${encodeURIComponent(id)}`, payload)
  return res.data
}

export async function deleteServer(id: string): Promise<void> {
  if (useMock()) {
    await sleep(260)
    const servers = mockGetServers().filter((s) => s.id !== id)
    mockSaveServers(servers)
    return
  }

  await http.delete(`/api/servers/${encodeURIComponent(id)}`)
}

export async function getServerMetrics(id: string, range: '1h' | '6h' | '24h' = '6h'): Promise<ServerMetricsPoint[]> {
  if (useMock()) {
    await sleep(280)
    void id
    return mockMetrics(range)
  }

  const res = await http.get<ServerMetricsPoint[]>(`/api/servers/${encodeURIComponent(id)}/metrics`, { params: { range } })
  return res.data
}

