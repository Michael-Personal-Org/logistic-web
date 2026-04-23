export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    timestamp: string
  }
}

export interface ApiError {
  success: false
  error: {
    message: string
    code: string
    statusCode: number
  }
}

export function isApiError(error: unknown): error is { response: { data: ApiError } } {
  return typeof error === 'object' && error !== null && 'response' in error
}
