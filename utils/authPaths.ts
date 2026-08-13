import { APP_CONFIGS } from '../qiankun/config'

/** 当前是否在任意子应用的登录页（含尾斜杠与 query） */
export function isAuthLoginPath(pathname = window.location.pathname): boolean {
  return /\/login\/?$/.test(pathname)
}

const SHELL_BASE = APP_CONFIGS.shell.basePath.replace(/\/$/, '')
const EMBEDDED_PATH_RE = new RegExp(`${SHELL_BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\/(app|standalone)\\/(editor|flow|ai)(\\/|$)`)

/** 独立部署的子应用路径段（须用 startsWith 边界匹配，避免 ua 误伤等） */
const STANDALONE_APPS = ['editor', 'flow', 'ai', 'ua', 'docs'] as const

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

/**
 * 从 pathname 解析独立子应用名（editor/flow/ai/ua/docs）
 */
function matchStandaloneApp(pathname: string): (typeof STANDALONE_APPS)[number] | null {
  for (const app of STANDALONE_APPS) {
    const prefix = `${SHELL_BASE}/${app}`
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return app
    }
  }
  return null
}

/** 解析应跳转的登录页 URL（独立子应用 vs Shell 容器） */
export function resolveLoginUrl(redirect?: string): string {
  const origin = window.location.origin
  const path = redirect ?? (window.location.pathname + window.location.search)

  if (isShellEmbedded()) {
    return `${origin}${SHELL_BASE}/login?redirect=${encodeURIComponent(path)}`
  }

  const app = matchStandaloneApp(window.location.pathname)
  if (app) {
    return `${origin}${SHELL_BASE}/${app}/login?redirect=${encodeURIComponent(path)}`
  }

  // 独立部署（非 Shell 嵌入）：使用当前 origin 的 /login
  return `${origin}/login?redirect=${encodeURIComponent(path)}`
}

export function redirectToLogin(redirect?: string): void {
  if (isAuthLoginPath()) return
  window.location.href = resolveLoginUrl(redirect)
}

/** 登录成功后的导航决策 */
export type PostLoginNavigation =
  | { mode: 'router'; path: string }
  | { mode: 'location'; href: string }

const PLATFORM_APP_ROOT_RE = /^\/schema-platform\/(editor|flow|ai|ua|docs)$/
const PLATFORM_APP_PATH_RE = /^\/schema-platform\/(editor|flow|ai|ua|docs)(\/|$)/

/**
 * 将 ?redirect= 解析为同应用 router 路径，或跨应用硬跳转 URL。
 * 跨应用时对「仅应用根路径」补尾斜杠，避免 nginx 无斜杠落到兜底 AI。
 */
export function resolvePostLoginNavigation(
  redirect: string,
  routeBase: string,
): PostLoginNavigation {
  const raw = (redirect || '/').trim() || '/'
  const base = routeBase.endsWith('/') ? routeBase : `${routeBase}/`
  const baseNoSlash = base.replace(/\/$/, '') || '/'

  if (PLATFORM_APP_PATH_RE.test(raw)) {
    const underCurrent =
      raw === baseNoSlash ||
      raw === base ||
      raw.startsWith(base) ||
      (baseNoSlash !== '/' && raw.startsWith(`${baseNoSlash}/`))

    if (underCurrent) {
      if (raw === baseNoSlash || raw === base) {
        return { mode: 'router', path: '/' }
      }
      let path = raw.slice(baseNoSlash.length)
      if (!path.startsWith('/')) path = `/${path}`
      return { mode: 'router', path: path || '/' }
    }

    const href = PLATFORM_APP_ROOT_RE.test(raw) ? `${raw}/` : raw
    return { mode: 'location', href }
  }

  const path = raw.startsWith('/') ? raw : `/${raw}`
  return { mode: 'router', path }
}
