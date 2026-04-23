import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { profilesApi } from '@/lib/api/profiles.api'

export const profileKeys = {
  myClient: ['profile', 'client', 'me'] as const,
  myDriver: ['profile', 'driver', 'me'] as const,
  client: (userId: string) => ['profile', 'client', userId] as const,
  driver: (userId: string) => ['profile', 'driver', userId] as const,
}

export function useMyClientProfile() {
  return useQuery({
    queryKey: profileKeys.myClient,
    queryFn: profilesApi.getMyClientProfile,
    retry: false, // No reintentar si no tiene perfil
  })
}

export function useMyDriverProfile() {
  return useQuery({
    queryKey: profileKeys.myDriver,
    queryFn: profilesApi.getMyDriverProfile,
    retry: false,
  })
}

export function useCreateClientProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: profilesApi.createClientProfile,
    onSuccess: (data) => {
      toast.success(data.message)
      void queryClient.invalidateQueries({ queryKey: profileKeys.myClient })
    },
    onError: () => toast.error('Error al crear el perfil'),
  })
}

export function useUpdateClientProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: profilesApi.updateClientProfile,
    onSuccess: (data) => {
      toast.success(data.message)
      void queryClient.invalidateQueries({ queryKey: profileKeys.myClient })
    },
    onError: () => toast.error('Error al actualizar el perfil'),
  })
}

export function useCreateDriverProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: profilesApi.createDriverProfile,
    onSuccess: (data) => {
      toast.success(data.message)
      void queryClient.invalidateQueries({ queryKey: profileKeys.myDriver })
    },
    onError: () => toast.error('Error al crear el perfil'),
  })
}

export function useUpdateDriverProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: profilesApi.updateDriverProfile,
    onSuccess: (data) => {
      toast.success(data.message)
      void queryClient.invalidateQueries({ queryKey: profileKeys.myDriver })
    },
    onError: () => toast.error('Error al actualizar el perfil'),
  })
}
