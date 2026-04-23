import { apiClient } from './client'

export interface AuditLog {
  id: string
  userId: string | null
  action: string
  resource: string
  resourceId: string | null
  metadata: Record<string, unknown> | null
  ipAddress: string | null
  createdAt: string
}

export interface ListAuditLogsParams {
  userId?: string
  action?: string
  resource?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

export interface ListAuditLogsResponse {
  logs: AuditLog[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const auditApi = {
  list: async (params?: ListAuditLogsParams): Promise<ListAuditLogsResponse> => {
    const res = await apiClient.get<{ data: ListAuditLogsResponse }>('/audit', { params })
    return res.data.data
  },
}
