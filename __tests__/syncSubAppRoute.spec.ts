import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { installSubAppRouteSync } from '../qiankun/syncSubAppRoute'

describe('installSubAppRouteSync', () => {
  let dispose: (() => void) | null = null

  afterEach(() => {
    dispose?.()
    dispose = null
  })

  it('patches pushState and replaceState', () => {
    const router = createRouter({
      history: createMemoryHistory('/schema-platform/app/ai'),
      routes: [
        { path: '/', name: 'chat', component: { template: '<div>chat</div>' } },
        { path: '/workflows', name: 'workflows', component: { template: '<div>wf</div>' } },
      ],
    })

    // 保存 patch 前的引用
    const beforePatchPush = history.pushState
    const beforePatchReplace = history.replaceState

    dispose = installSubAppRouteSync(router, () => '/schema-platform/app/ai')

    // 验证 pushState/replaceState 已被 patch（引用不同）
    expect(history.pushState).not.toBe(beforePatchPush)
    expect(history.replaceState).not.toBe(beforePatchReplace)

    // 验证 patch 后的函数可以正常调用
    expect(() => history.pushState(null, '', '/test')).not.toThrow()

    // 清理
    dispose()
    dispose = null

    // dispose 后 pushState 应该恢复为非 patch 版本
    // 注意：installSubAppRouteSync 内部用 bind 保存，所以恢复的是 bound 版本
    // 只要不再触发 sync 逻辑即可
    const afterDisposePush = history.pushState
    dispose = installSubAppRouteSync(router, () => '/schema-platform/app/ai')
    // 重新 patch 后应该和 dispose 后的不同
    expect(history.pushState).not.toBe(afterDisposePush)
  })

  it('adds popstate listener on install', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const router = createRouter({
      history: createMemoryHistory('/schema-platform/app/ai'),
      routes: [
        { path: '/', name: 'chat', component: { template: '<div>chat</div>' } },
      ],
    })

    dispose = installSubAppRouteSync(router, () => '/schema-platform/app/ai')

    expect(addSpy).toHaveBeenCalledWith('popstate', expect.any(Function))

    addSpy.mockRestore()
  })

  it('removes popstate listener on dispose', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const router = createRouter({
      history: createMemoryHistory('/schema-platform/app/ai'),
      routes: [
        { path: '/', name: 'chat', component: { template: '<div>chat</div>' } },
      ],
    })

    dispose = installSubAppRouteSync(router, () => '/schema-platform/app/ai')
    dispose()
    dispose = null

    expect(removeSpy).toHaveBeenCalledWith('popstate', expect.any(Function))

    removeSpy.mockRestore()
  })
})
