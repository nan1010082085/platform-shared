/**
 * useAuth -- 共享认证业务逻辑
 *
 * 所有子应用（admin、editor、flow、ai、shell）统一使用此 composable。
 * - 调用 /api/auth/login、/api/auth/me、/api/auth/refresh、/api/auth/logout
 * - 协调 useAuthStore 的 loading/token/user 状态
 * - 自动刷新 access token（过期前 60s）
 * - 登录后跳转、登出后跳转
 *
 * Dependencies:
 * - useAuthStore (状态持有)
 * - apiClient (HTTP)
 * - vue-router (导航)
 */
import { onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import { apiClient, setTokenProvider, setUnauthorizedHandler } from './apiClient'
import {
  startTokenRefreshSchedule,
  stopTokenRefreshSchedule,
  refreshAccessToken,
} from './authSession'
import { resolvePostLoginNavigation } from './authPaths'
import type { LoginPayload, LoginResponse, AuthUser } from './authTypes'

/** Whether tokenProvider has been injected (once globally) */
let providerInitialized = false

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  const { user, accessToken, refreshToken, isAuthenticated, loading } = storeToRefs(store)

  // Inject tokenProvider + 401 handler so apiClient auto-attaches Authorization header
  if (!providerInitialized) {
    setTokenProvider(() => store.accessToken)
    setUnauthorizedHandler(() => {
      stopTokenRefreshSchedule()
      store.reset()
    })
    providerInitialized = true
  }

  function scheduleRefresh(expiresIn: number): void {
    startTokenRefreshSchedule(expiresIn)
  }

  function cancelRefresh(): void {
    stopTokenRefreshSchedule()
  }

  async function doRefresh(): Promise<void> {
    const ok = await refreshAccessToken()
    if (!ok) {
      cancelRefresh()
      store.reset()
    }
  }

  /**
   * Username/password login.
   * On success: persist tokens + user, redirect to ?redirect= or /.
   *
   * @param payload - { username, password }
   * @param onSuccess - 可选的成功回调，用于自定义跳转逻辑
   */
  async function login(payload: LoginPayload, onSuccess?: (redirect: string) => void): Promise<void> {
    store.setLoading('login', true)
    try {
      const res = await apiClient.post<LoginResponse>('/auth/login', payload)
      store.setTokens(res.accessToken, res.refreshToken)
      store.setUser(res.user)
      store.setUserKey(res.user.id)
      scheduleRefresh(res.expiresIn)

      const redirect = (route.query.redirect as string) || '/'
      const base = import.meta.env.BASE_URL || import.meta.env.VITE_ROUTE_BASE || '/'
      const nav = resolvePostLoginNavigation(redirect, base)

      if (onSuccess) {
        onSuccess(nav.mode === 'router' ? nav.path : nav.href)
      } else if (nav.mode === 'location') {
        window.location.assign(nav.href)
      } else {
        await router.push(nav.path)
      }
    } finally {
      store.setLoading('login', false)
    }
  }

  /**
   * Fetch current user by existing token.
   * Used to restore login state after page refresh.
   */
  async function fetchUser(): Promise<void> {
    if (!accessToken.value) return

    store.setLoading('fetchUser', true)
    try {
      const res = await apiClient.get<AuthUser>('/auth/me')
      store.setUser(res)
      // Re-schedule refresh (we don't know original expiresIn after page reload,
      // assume 15min = 900s from now as the token was issued at login)
      scheduleRefresh(900)
    } catch {
      // Token invalid -- clear state
      cancelRefresh()
      store.reset()
    } finally {
      store.setLoading('fetchUser', false)
    }
  }

  /**
   * Logout: call server, clear state, redirect to /login.
   */
  async function logout(): Promise<void> {
    cancelRefresh()
    try {
      await apiClient.post('/auth/logout')
    } finally {
      store.reset()
      await router.push('/login')
    }
  }

  // Cleanup on component unmount
  onUnmounted(() => {
    // DO NOT cancel refresh here -- it should persist across component mounts.
    // Only logout() and 401 handler cancel it.
  })

  return {
    // state (storeToRefs preserves reactivity)
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    loading,
    // methods
    login,
    fetchUser,
    logout,
    doRefresh,
  }
}
