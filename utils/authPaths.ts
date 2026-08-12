import { APP_CONFIGS } from '../qiankun/config'

/** 当前是否在任意子应用的登录页（含尾斜杠与 query） */
export function isAuthLoginPath(pathname = window.location.pathname): boolean {
  return /\/login\/?$/.test(pathname)
}

const SHELL_BASE = APP_CONFIGS.shell.basePath.replace(/\/$/, '')
const EMBEDDED_PATH_RE = new RegExp(`${SHELL_BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\/(app|standalone)\\/(editor|flow|ai)(\\/|$)`)

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean
  }
}

/** 是否运行在 Shell 容器内（qiankun /app /standalone） */
export function isShellEmbedded(pathname = window.location.pathname): boolean {
  if (typeof window !== 'undefined' && window.__POWERED_BY_QIANKUN__) return true
  return EMBEDDED_PATH_RE.test(pathname)
}

/** 解析应跳转的登录页 URL（独立子应用 vs Shell 容器） */
export function resolveLoginUrl(redirect?: string): string {
  const origin = window.location.origin
  const path = redirect ?? (window.location.pathname + window.location.search)

  if (isShellEmbedded()) {
    return `${origin}${SHELL_BASE}/login?redirect=${encodeURIComponent(path)}`
  }

  const pathname = window.location.pathname
  if (pathname.includes(`${SHELL_BASE}/editor`)) {
    return `${origin}${SHELL_BASE}/editor/login?redirect=${encodeURIComponent(path)}`
  }
  if (pathname.includes(`${SHELL_BASE}/flow`)) {
    return `${origin}${SHELL_BASE}/flow/login?redirect=${encodeURIComponent(path)}`
  }
  if (pathname.includes(`${SHELL_BASE}/ai`)) {
    return `${origin}${SHELL_BASE}/ai/login?redirect=${encodeURIComponent(path)}`
  }

  // 独立部署（非 Shell 嵌入）：使用当前 origin 的 /login
  return `${origin}/login?redirect=${encodeURIComponent(path)}`
}

export function redirectToLogin(redirect?: string): void {
  if (isAuthLoginPath()) return
  window.location.href = resolveLoginUrl(redirect)
}
