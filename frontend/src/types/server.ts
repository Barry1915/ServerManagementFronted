export type ServerStatus = 'online' | 'offline' | 'unknown'

export type Server = {
  id: string
  name: string
  host: string
  port: number
  username?: string
  tags?: string[]
  status: ServerStatus
  createdAt: string
  updatedAt: string
}

export type ServerMetricsPoint = {
  ts: number
  cpu: number
  mem: number
  disk: number
}

