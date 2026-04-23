import { useQuery } from '@tanstack/react-query'
import type { ListAuditLogsParams } from '@/lib/api/audit.api'
import { auditApi } from '@/lib/api/audit.api'

export const auditKeys = {
  all: ['audit'] as const,
  list: (params?: ListAuditLogsParams) => [...auditKeys.all, 'list', params] as const,
}

export function useAuditLogs(params?: ListAuditLogsParams) {
  return useQuery({
    queryKey: auditKeys.list(params),
    queryFn: () => auditApi.list(params),
  })
}
