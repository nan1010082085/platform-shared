import type { Router } from 'vue-router'

/**
 * qiankun 子应用与宿主共用浏览器 History 时，宿主 router.push 不会触发子应用 vue-router 更新。
 * 监听 popstate 并 patch pushState/replaceState，按当前 URL 同步子应用路由。
 */
export function installSubAppRouteSync(
  router: Router,
  getRouteBase: () => string,
): () => void {
  function syncFromBrowserUrl(): void {
    const base = getRouteBase().replace(/\/$/, '')
    if (!base) return

    const pathname = window.location.pathname
    if (!pathname.startsWith(base)) return

    const subPath = pathname.slice(base.length) || '/'
    const target = router.resolve(subPath)
    const current = router.currentRoute.value
    if (target.fullPath !== current.fullPath) {
      void router.replace(target.fullPath)
    }
  }

  syncFromBrowserUrl()

  const onPopState = () => syncFromBrowserUrl()
  window.addEventListener('popstate', onPopState)

  const pushState = history.pushState.bind(history)
  const replaceState = history.replaceState.bind(history)

  history.pushState = (...args: Parameters<History['pushState']>) => {
    pushState(...args)
    syncFromBrowserUrl()
  }
  history.replaceState = (...args: Parameters<History['replaceState']>) => {
    replaceState(...args)
    syncFromBrowserUrl()
  }

  return () => {
    window.removeEventListener('popstate', onPopState)
    history.pushState = pushState
    history.replaceState = replaceState
  }
}
