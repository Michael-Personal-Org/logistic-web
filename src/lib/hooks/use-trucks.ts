import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ListTrucksParams } from '@/lib/api/trucks.api'
import { trucksApi } from '@/lib/api/trucks.api'

export const truckKeys = {
  all: ['trucks'] as const,
  list: (params?: ListTrucksParams) => [...truckKeys.all, 'list', params] as const,
  detail: (id: string) => [...truckKeys.all, 'detail', id] as const,
}

export function useTrucks(params?: ListTrucksParams) {
  return useQuery({
    queryKey: truckKeys.list(params),
    queryFn: () => trucksApi.list(params),
  })
}

export function useTruck(truckId: string) {
  return useQuery({
    queryKey: truckKeys.detail(truckId),
    queryFn: () => trucksApi.getOne(truckId),
    enabled: !!truckId,
  })
}

export function useCreateTruck() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: trucksApi.create,
    onSuccess: (data) => {
      toast.success(data.message)
      void queryClient.invalidateQueries({ queryKey: truckKeys.all })
    },
    onError: () => toast.error('Error al crear el camión'),
  })
}

export function useUpdateTruck() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      truckId,
      data,
    }: Parameters<typeof trucksApi.update>[0] extends string
      ? { truckId: string; data: Parameters<typeof trucksApi.update>[1] }
      : never) => trucksApi.update(truckId, data),
    onSuccess: (data) => {
      toast.success(data.message)
      void queryClient.invalidateQueries({ queryKey: truckKeys.all })
    },
    onError: () => toast.error('Error al actualizar el camión'),
  })
}

export function useDeleteTruck() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: trucksApi.delete,
    onSuccess: (data) => {
      toast.success(data.message)
      void queryClient.invalidateQueries({ queryKey: truckKeys.all })
    },
    onError: () => toast.error('Error al eliminar el camión'),
  })
}
