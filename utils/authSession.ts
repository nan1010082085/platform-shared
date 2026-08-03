/**
 * authSession — 三能力平台 + Shell 统一鉴权会话
 *
 * - token / refreshToken / SSO clientId 持久化
 * - 容器内（/app、/standalone、qiankun）401 跳转 Shell 登录
 * - access token 自动刷新
 */
import { getActivePinia } from 'pinia'
import {
  apiClient,
  setTokenProvider,
  setUnauthorizedHandler,
  setTokenRefreshHandler,
} from './apiClient.js'
import { isShellEmbedded, redirectToLogin } from './authPaths.js'
import { useAuthStore } from './stores/authStore.js'
import type { AuthUser } from './authTypes.js'
import { setSocketTokenProvider, connect as connectSocket } from '../socket/index.js'

export const ACCESS_TOKEN_KEY = 'sfp_access_token'
export const REFRESH_TOKEN_KEY = 'sfp_refresh_token'
export const SSO_CLIENT_ID_KEY = 'sfp_sso_client_id'

export { isShellEmbedded, resolveLoginUrl, redirectToLogin } from './authPaths.js'

export interface CapabilityAuthOptions {
  /** 将 resolveAuthToken 注入子项目自有 fetch 客户端（如 aiApi） */
  registerTokenProvider?: (getToken: () => string | null) => void
  /** 覆盖默认 401 行为；未传则用 handleUnauthorized */
  onUnauthorized?: () => void
  /** 挂载后恢复会话并启动 refresh 调度，默认 true */
  bootstrap?: boolean
}

let refreshTimer: ReturnType<typeof setTimeout> | null = null

export function persistSSOClientId(clientId: string): void {
  localStorage.setItem(SSO_CLIENT_ID_KEY, clientId)
}

export function resolveSSOClientId(fallback: string): string {
  return localStorage.getItem(SSO_CLIENT_ID_KEY) || fallback
}

export function resolveAuthToken(): string | null {
  const pinia = getActivePinia()
  if (pinia) {
    const store = useAuthStore(pinia)
    if (store.accessToken) return store.accessToken
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function clearAuthStorage(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  const pinia = getActivePinia()
  if (pinia) useAuthStore(pinia).reset()
}

export function stopTokenRefreshSchedule(): void {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
}

function syncTokensToStore(access: string, refresh?: string | null): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, access)
  if (refresh !== undefined && refresh !== null) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  }
  const pinia = getActivePinia()
  if (pinia) {
    useAuthStore(pinia).setTokens(access, refresh ?? undefined)
  }
  // token 更新后重连 socket，确保 ws 用最新 token
  // 覆盖 login / refresh / bootstrap 恢复场景；connect 内部已连则跳过
  connectSocket()
}

/** 使用 refresh token 换取新 access token */
export async function refreshAccessToken(): Promise<boolean> {
  const pinia = getActivePinia()
  const refresh =
    (pinia ? useAuthStore(pinia).refreshToken : null) ?? localStorage.getItem(REFRESH_TOKEN_KEY)
  if (!refresh) return false

  try {
    const res = await apiClient.post<{
      accessToken: string
      refreshToken?: string
      expiresIn: number
    }>('/auth/refresh', { refreshToken: refresh })
    syncTokensToStore(res.accessToken, res.refreshToken ?? refresh)
    startTokenRefreshSchedule(res.expiresIn)
    return true
  } catch {
    stopTokenRefreshSchedule()
    clearAuthStorage()
    return false
  }
}

/** 登录成功后或页面恢复时调度 refresh（expiresIn 单位：秒） */
export function startTokenRefreshSchedule(expiresInSeconds: number): void {
  stopTokenRefreshSchedule()
  const delay = Math.max((expiresInSeconds - 60) * 1000, 10_000)
  refreshTimer = setTimeout(() => {
    void refreshAccessToken()
  }, delay)
}

/** 校验当前 token，必要时 refresh，并恢复 user */
export async function bootstrapAuthSession(): Promise<boolean> {
  const token = resolveAuthToken()
  if (!token) return false

  const pinia = getActivePinia()
  if (pinia) {
    const store = useAuthStore(pinia)
    if (!store.accessToken) {
      store.setTokens(token, localStorage.getItem(REFRESH_TOKEN_KEY))
    }
    if (store.user) {
      startTokenRefreshSchedule(900)
      return true
    }
  }

  try {
    const user = await apiClient.get<AuthUser>('/auth/me')
    if (pinia) useAuthStore(pinia).setUser(user)
    startTokenRefreshSchedule(900)
    return true
  } catch {
    const refreshed = await refreshAccessToken()
    if (!refreshed) {
      clearAuthStorage()
      return false
    }
    try {
      const user = await apiClient.get<AuthUser>('/auth/me')
      if (pinia) useAuthStore(pinia).setUser(user)
      return true
    } catch {
      clearAuthStorage()
      return false
    }
  }
}

export function handleUnauthorized(redirect?: string): void {
  stopTokenRefreshSchedule()
  clearAuthStorage()
  redirectToLogin(redirect)
}

/** 子应用 bootstrap：注入 token 提供者 + 401 统一跳转 + Socket + 可选 refresh 重试 */
export function setupAppAuth(): void {
  setTokenProvider(() => resolveAuthToken())
  setUnauthorizedHandler(() => handleUnauthorized())
  setTokenRefreshHandler(refreshAccessToken)
}

/**
 * 三能力平台（editor / flow / ai）统一 JWT 初始化。
 * 在 createPinia() 之后、挂载根组件之前调用。
 */
export function initCapabilityPlatformAuth(options: CapabilityAuthOptions = {}): void {
  setupAppAuth()
  setSocketTokenProvider(resolveAuthToken)
  options.registerTokenProvider?.(resolveAuthToken)
  if (options.onUnauthorized) {
    setUnauthorizedHandler(options.onUnauthorized)
  }
  if (options.bootstrap !== false) {
    void bootstrapAuthSession().then(() => connectSocket())
  }
}

export type AuthRouteTarget = {
  meta?: { public?: boolean }
  fullPath: string
  name?: string | symbol | null
}

/** 路由守卫：受保护路由须有效登录态 */
export async function guardAuthenticatedRoute(
  to: AuthRouteTarget,
): Promise<boolean | { name: string; query: { redirect: string } }> {
  if (to.meta?.public) return true

  const token = resolveAuthToken()
  if (!token) {
    if (isShellEmbedded()) {
      redirectToLogin()
      return false
    }
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  const ok = await bootstrapAuthSession()
  if (!ok) {
    if (isShellEmbedded()) {
      redirectToLogin(to.fullPath)
      return false
    }
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
}
