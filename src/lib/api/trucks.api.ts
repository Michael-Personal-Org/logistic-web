import type { CargoType, ListTrucksResponse, Truck } from '@/lib/types/truck.types'
import { apiClient } from './client'

export interface ListTrucksParams {
  isAvailable?: boolean
  cargoType?: CargoType
  page?: number
  limit?: number
}

export const trucksApi = {
  list: async (params?: ListTrucksParams): Promise<ListTrucksResponse> => {
    const res = await apiClient.get<{ data: ListTrucksResponse }>('/trucks', { params })
    return res.data.data
  },

  getOne: async (truckId: string): Promise<Truck> => {
    const res = await apiClient.get<{ data: Truck }>(`/trucks/${truckId}`)
    return res.data.data
  },

  create: async (data: {
    plateNumber: string
    model: string
    capacity: string
    allowedCargoTypes: CargoType[]
  }): Promise<{ truckId: string; message: string }> => {
    const res = await apiClient.post<{ data: { truckId: string; message: string } }>(
      '/trucks',
      data
    )
    return res.data.data
  },

  update: async (
    truckId: string,
    data: Partial<{
      model: string
      capacity: string
      allowedCargoTypes: CargoType[]
      isAvailable: boolean
    }>
  ): Promise<{ message: string }> => {
    const res = await apiClient.put<{ data: { message: string } }>(`/trucks/${truckId}`, data)
    return res.data.data
  },

  assignDriver: async (truckId: string, driverId: string): Promise<{ message: string }> => {
    const res = await apiClient.patch<{ data: { message: string } }>(
      `/trucks/${truckId}/assign-driver`,
      { driverId }
    )
    return res.data.data
  },

  delete: async (truckId: string): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ data: { message: string } }>(`/trucks/${truckId}`)
    return res.data.data
  },
}
