import { describe, it, expect, afterEach, vi } from 'vitest'
import {
  resolveLoginUrl,
  resolvePostLoginNavigation,
} from '../utils/authPaths.ts'

function stubLocation(pathname: string, origin = 'https://pyflow.icu') {
  vi.stubGlobal('window', {
    location: {
      origin,
      pathname,
      search: '',
      href: `${origin}${pathname}`,
    },
    __POWERED_BY_QIANKUN__: undefined,
  })
}

describe('resolveLoginUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('独立 UA 应用跳转到 /schema-platform/ua/login', () => {
    stubLocation('/schema-platform/ua/tenants')
    expect(resolveLoginUrl()).toBe(
      'https://pyflow.icu/schema-platform/ua/login?redirect=%2Fschema-platform%2Fua%2Ftenants',
    )
  })

  it('独立 AI 应用仍跳转到 /schema-platform/ai/login', () => {
    stubLocation('/schema-platform/ai/rag')
    expect(resolveLoginUrl()).toBe(
      'https://pyflow.icu/schema-platform/ai/login?redirect=%2Fschema-platform%2Fai%2Frag',
    )
  })

  it('不把 /schema-platform/ua 误判为 AI', () => {
    stubLocation('/schema-platform/ua')
    expect(resolveLoginUrl()).toContain('/schema-platform/ua/login')
    expect(resolveLoginUrl()).not.toContain('/schema-platform/ai/login')
  })
})

describe('resolvePostLoginNavigation', () => {
  it('同应用：去掉 base 前缀后走 router', () => {
    expect(
      resolvePostLoginNavigation('/schema-platform/ua/tenants', '/schema-platform/ua/'),
    ).toEqual({ mode: 'router', path: '/tenants' })
  })

  it('同应用：redirect 等于 base（无尾斜杠）时落到 /', () => {
    expect(
      resolvePostLoginNavigation('/schema-platform/ua', '/schema-platform/ua/'),
    ).toEqual({ mode: 'router', path: '/' })
  })

  it('跨应用：AI 登录后目标是 UA 时硬跳转，并补齐尾斜杠', () => {
    expect(
      resolvePostLoginNavigation('/schema-platform/ua', '/schema-platform/ai/'),
    ).toEqual({ mode: 'location', href: '/schema-platform/ua/' })
  })

  it('跨应用：完整 UA 路径硬跳转且不拼到当前 base', () => {
    expect(
      resolvePostLoginNavigation('/schema-platform/ua/tenants', '/schema-platform/ai/'),
    ).toEqual({ mode: 'location', href: '/schema-platform/ua/tenants' })
  })

  it('默认 redirect / 走 router', () => {
    expect(resolvePostLoginNavigation('/', '/schema-platform/ua/')).toEqual({
      mode: 'router',
      path: '/',
    })
  })
})
