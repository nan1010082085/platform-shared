/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

const storage = new Map<string, string>()

vi.stubGlobal('localStorage', {
  getItem: (k: string) => storage.get(k) ?? null,
  setItem: (k: string, v: string) => { storage.set(k, v) },
  removeItem: (k: string) => { storage.delete(k) },
})

vi.mock('../socket/index.js', () => ({
  setSocketTokenProvider: vi.fn(),
}))

vi.mock('./apiClient.js', () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
  setTokenProvider: vi.fn(),
  setUnauthorizedHandler: vi.fn(),
  setTokenRefreshHandler: vi.fn(),
}))

import { setSocketTokenProvider } from '../socket/index.js'
import {
  setTokenProvider,
  setUnauthorizedHandler,
  setTokenRefreshHandler,
} from './apiClient.js'
import {
  initCapabilityPlatformAuth,
  resolveAuthToken,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from './authSession.js'

describe('initCapabilityPlatformAuth', () => {
  beforeEach(() => {
    storage.clear()
    vi.clearAllMocks()
  })

  it('wires apiClient, socket, and optional registerTokenProvider', () => {
    const register = vi.fn()
    initCapabilityPlatformAuth({
      registerTokenProvider: register,
      bootstrap: false,
    })

    expect(setTokenProvider).toHaveBeenCalled()
    expect(setUnauthorizedHandler).toHaveBeenCalled()
    expect(setTokenRefreshHandler).toHaveBeenCalled()
    expect(setSocketTokenProvider).toHaveBeenCalled()
    expect(register).toHaveBeenCalledWith(resolveAuthToken)

    storage.set(ACCESS_TOKEN_KEY, 'access-abc')
    storage.set(REFRESH_TOKEN_KEY, 'refresh-xyz')
    expect(resolveAuthToken()).toBe('access-abc')
  })
})
