import { apiClient } from './client'

export interface ClientProfile {
  id: string
  userId: string
  companyName: string
  rnc: string | null
  isApproved: boolean
  approvedAt: string | null
  emergencyContact: string | null
  createdAt: string
  updatedAt: string
}

export interface DriverProfile {
  id: string
  userId: string
  vehiclePlate: string
  licenseNumber: string
  licenseType: string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export const profilesApi = {
  getMyClientProfile: async (): Promise<ClientProfile> => {
    const res = await apiClient.get<{ data: ClientProfile }>('/profiles/client')
    return res.data.data
  },

  createClientProfile: async (data: {
    companyName: string
    rnc?: string
    emergencyContact?: string
  }): Promise<{ profileId: string; message: string }> => {
    const res = await apiClient.post<{ data: { profileId: string; message: string } }>(
      '/profiles/client',
      data
    )
    return res.data.data
  },

  updateClientProfile: async (data: {
    companyName?: string
    rnc?: string
    emergencyContact?: string
  }): Promise<{ message: string }> => {
    const res = await apiClient.put<{ data: { message: string } }>('/profiles/client', data)
    return res.data.data
  },

  getMyDriverProfile: async (): Promise<DriverProfile> => {
    const res = await apiClient.get<{ data: DriverProfile }>('/profiles/driver')
    return res.data.data
  },

  createDriverProfile: async (data: {
    vehiclePlate: string
    licenseNumber: string
    licenseType: string
  }): Promise<{ profileId: string; message: string }> => {
    const res = await apiClient.post<{ data: { profileId: string; message: string } }>(
      '/profiles/driver',
      data
    )
    return res.data.data
  },

  updateDriverProfile: async (data: {
    vehiclePlate?: string
    licenseNumber?: string
    licenseType?: string
    isAvailable?: boolean
  }): Promise<{ message: string }> => {
    const res = await apiClient.put<{ data: { message: string } }>('/profiles/driver', data)
    return res.data.data
  },

  approveClientProfile: async (userId: string): Promise<{ message: string }> => {
    const res = await apiClient.patch<{ data: { message: string } }>(
      `/profiles/client/${userId}/approve`
    )
    return res.data.data
  },

  getClientProfileByUserId: async (userId: string): Promise<ClientProfile> => {
    const res = await apiClient.get<{ data: ClientProfile }>(`/profiles/client/${userId}`)
    return res.data.data
  },

  getDriverProfileByUserId: async (userId: string): Promise<DriverProfile> => {
    const res = await apiClient.get<{ data: DriverProfile }>(`/profiles/driver/${userId}`)
    return res.data.data
  },
}
