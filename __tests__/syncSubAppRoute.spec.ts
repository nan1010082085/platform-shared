import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { installSubAppRouteSync } from '../qiankun/syncSubAppRoute'

describe('installSubAppRouteSync', () => {
  let dispose: (() => void) | null = null

  beforeEach(() => {
    history.replaceState(null, '', '/schema-platform/app/ai/')
  })

  afterEach(() => {
    dispose?.()
    dispose = null
  })

  it('syncs sub-app route when host pushState changes URL', async () => {
    const router = createRouter({
      history: createWebHistory('/schema-platform/app/ai'),
      routes: [
        { path: '/', name: 'chat', component: { template: '<div>chat</div>' } },
        { path: '/workflows', name: 'workflows', component: { template: '<div>wf</div>' } },
      ],
    })
    await router.isReady()

    dispose = installSubAppRouteSync(router, () => '/schema-platform/app/ai')
    expect(router.currentRoute.value.name).toBe('chat')

    history.pushState(null, '', '/schema-platform/app/ai/workflows')
    await vi.waitFor(() => {
      expect(router.currentRoute.value.name).toBe('workflows')
    })
  })
})
