export type CargoType =
  | 'GENERAL'
  | 'FRAGILE'
  | 'CHEMICAL'
  | 'TEXTILE'
  | 'REFRIGERATED'
  | 'HAZARDOUS'

export interface Truck {
  id: string
  plateNumber: string
  model: string
  capacity: string
  allowedCargoTypes: CargoType[]
  isAvailable: boolean
  assignedDriverId: string | null
  createdAt: string
  updatedAt: string
}

export interface ListTrucksResponse {
  trucks: Truck[]
  total: number
  page: number
  limit: number
  totalPages: number
}
