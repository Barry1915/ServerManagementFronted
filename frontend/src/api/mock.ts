import dayjs from 'dayjs'
import type { Server, ServerMetricsPoint, ServerStatus } from '@/types/server'

const MOCK_SERVERS_KEY = 'sm_mock_servers'

export function useMock() {
  return String(import.meta.env.VITE_USE_MOCK || '').toLowerCase() === 'true'
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function seedServers(): Server[] {
  const now = dayjs()
  return [
    {
      id: 'srv-1',
      name: '生产-主节点',
      host: '10.0.0.11',
      port: 22,
      username: 'root',
      tags: ['prod', 'core'],
      status: 'online',
      createdAt: now.subtract(12, 'day').toISOString(),
      updatedAt: now.subtract(2, 'minute').toISOString(),
    },
    {
      id: 'srv-2',
      name: '生产-备节点',
      host: '10.0.0.12',
      port: 22,
      username: 'root',
      tags: ['prod'],
      status: 'online',
      createdAt: now.subtract(10, 'day').toISOString(),
      updatedAt: now.subtract(6, 'minute').toISOString(),
    },
    {
      id: 'srv-3',
      name: '测试-构建机',
      host: '10.0.1.20',
      port: 22,
      username: 'ubuntu',
      tags: ['staging', 'ci'],
      status: 'offline',
      createdAt: now.subtract(4, 'day').toISOString(),
      updatedAt: now.subtract(2, 'hour').toISOString(),
    },
  ]
}

export function mockGetServers(): Server[] {
  const raw = localStorage.getItem(MOCK_SERVERS_KEY)
  if (!raw) {
    const seeded = seedServers()
    localStorage.setItem(MOCK_SERVERS_KEY, JSON.stringify(seeded))
    return seeded
  }
  try {
    return JSON.parse(raw) as Server[]
  } catch {
    const seeded = seedServers()
    localStorage.setItem(MOCK_SERVERS_KEY, JSON.stringify(seeded))
    return seeded
  }
}

export function mockSaveServers(servers: Server[]) {
  localStorage.setItem(MOCK_SERVERS_KEY, JSON.stringify(servers))
}

export function mockStatusBadge(status: ServerStatus) {
  switch (status) {
    case 'online':
      return { text: '在线', type: 'success' as const }
    case 'offline':
      return { text: '离线', type: 'danger' as const }
    default:
      return { text: '未知', type: 'info' as const }
  }
}

export function mockMetrics(range: '1h' | '6h' | '24h' = '6h'): ServerMetricsPoint[] {
  const points = range === '1h' ? 24 : range === '6h' ? 36 : 48
  const stepMs = range === '1h' ? 2.5 * 60_000 : range === '6h' ? 10 * 60_000 : 30 * 60_000
  const start = Date.now() - points * stepMs
  const base = {
    cpu: 35 + Math.random() * 10,
    mem: 55 + Math.random() * 8,
    disk: 70 + Math.random() * 5,
  }

  return Array.from({ length: points }, (_, i) => {
    const t = start + i * stepMs
    const wobble = Math.sin(i / 3) * 6 + (Math.random() - 0.5) * 6
    return {
      ts: t,
      cpu: Math.max(0, Math.min(100, base.cpu + wobble)),
      mem: Math.max(0, Math.min(100, base.mem + wobble * 0.6)),
      disk: Math.max(0, Math.min(100, base.disk + wobble * 0.25)),
    }
  })
}

