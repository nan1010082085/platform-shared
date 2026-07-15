/**
 * apiClient -- 共享 HTTP 客户端（基于 axios）
 *
 * 所有子项目（shell、editor、flow、ai-app、admin）统一使用此客户端。
 * - 请求拦截器：自动附加 Authorization header
 * - 响应拦截器：统一错误处理，401 触发 unauthorizedHandler
 */
import axios, { type AxiosInstance, type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { isAuthLoginPath, redirectToLogin } from './authPaths.js'

export class ApiError extends Error {
  public readonly status: number
  public readonly details: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: { message: string; details?: unknown }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/schema-platform/api'
const ACCESS_TOKEN_KEY = 'sfp_access_token'

/** Token 提供者，由 useAuth 注入，避免 apiClient 直接耦合 store */
let tokenProvider: (() => string | null) | null = null

function resolveAuthToken(): string | null {
  return tokenProvider?.() ?? localStorage.getItem(ACCESS_TOKEN_KEY)
}

/** 401 回调，由 useAuth 注入，用于清除认证状态 */
let onUnauthorized: (() => void) | null = null

export function setTokenProvider(provider: () => string | null): void {
  tokenProvider = provider
}

/** 401 时尝试 refresh 后重试一次（由 authSession 注入） */
let tokenRefreshHandler: (() => Promise<boolean>) | null = null

export function setTokenRefreshHandler(handler: () => Promise<boolean>): void {
  tokenRefreshHandler = handler
}

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler
}

// ── axios 实例 ──

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── 请求拦截器：自动附加 token ──

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = resolveAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(error),
)

// ── 响应拦截器：统一错误处理 ──

instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const json = response.data
    if (!json.success) {
      return Promise.reject(
        new ApiError(json.error?.message ?? 'Request failed', response.status, json.error?.details),
      )
    }
    return response
  },
  (error: unknown) => {
    const axiosError = error as AxiosError
    if (axios.isAxiosError(axiosError) && axiosError.response) {
      const { status, data } = axiosError.response
      const config = axiosError.config as (InternalAxiosRequestConfig & { _authRetried?: boolean }) | undefined

      // 401：先 refresh 再重试一次，仍失败则清会话
      if (
        status === 401
        && config
        && !config._authRetried
        && config.url !== '/auth/login'
        && config.url !== '/auth/refresh'
        && tokenRefreshHandler
      ) {
        config._authRetried = true
        return tokenRefreshHandler().then((ok) => {
          if (!ok) {
            onUnauthorized?.()
            if (!isAuthLoginPath()) redirectToLogin()
            return Promise.reject(new ApiError('Authentication required', 401))
          }
          const token = resolveAuthToken()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
          return instance.request(config)
        })
      }

      if (status === 401 && axiosError.config?.url !== '/auth/login') {
        onUnauthorized?.()
        if (!isAuthLoginPath()) {
          redirectToLogin()
        }
        return Promise.reject(new ApiError('Authentication required', 401))
      }

      const body = data as ApiResponse<unknown> | string | undefined
      const message =
        (typeof body === 'object' && body !== null ? body.error?.message : undefined)
        ?? (error instanceof Error ? error.message : 'Request failed')
      return Promise.reject(new ApiError(message, status))
    }

    // 网络错误等
    return Promise.reject(new ApiError(error instanceof Error ? error.message : 'Network error', 0))
  },
)

// ── 对外 API ──

export const apiClient = {
  get: <T>(path: string) => instance.get<ApiResponse<T>>(path).then((r: AxiosResponse<ApiResponse<T>>) => r.data.data as T),
  post: <T>(path: string, body?: unknown) => instance.post<ApiResponse<T>>(path, body).then((r: AxiosResponse<ApiResponse<T>>) => r.data.data as T),
  put: <T>(path: string, body?: unknown) => instance.put<ApiResponse<T>>(path, body).then((r: AxiosResponse<ApiResponse<T>>) => r.data.data as T),
  patch: <T>(path: string, body?: unknown) => instance.patch<ApiResponse<T>>(path, body).then((r: AxiosResponse<ApiResponse<T>>) => r.data.data as T),
  delete: <T>(path: string) => instance.delete<ApiResponse<T>>(path).then((r: AxiosResponse<ApiResponse<T>>) => r.data.data as T),
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export async function fetchSchemaById(id: string): Promise<{ id: string; name: string; json: unknown }> {
  return apiClient.get(`/schemas/${encodeURIComponent(id)}`)
}

export async function fetchLatestFlowVersion(definitionId: string): Promise<{ id: string; definitionId: string; version: string; graph: { nodes: unknown[]; edges: unknown[] }; metadata: unknown; createdAt: string; updatedAt: string }> {
  return apiClient.get(`/flows/${encodeURIComponent(definitionId)}/versions/latest`)
}
