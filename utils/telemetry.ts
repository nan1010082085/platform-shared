/**
 * platform-shared telemetry — 前端埋点与错误上报
 *
 * 批量上报，server 端点未就绪时缓冲到 localStorage。
 */
import { apiClient } from './apiClient.js'

export interface TelemetryEvent {
  name: string
  properties?: Record<string, unknown>
  timestamp?: number
}

export interface ErrorReport {
  message: string
  stack?: string
  context?: Record<string, unknown>
  timestamp?: number
}

const BUFFER_KEY = 'sp_telemetry_buffer'
const FLUSH_INTERVAL_MS = 10_000
const MAX_BUFFER = 100

let buffer: TelemetryEvent[] = []
let flushTimer: ReturnType<typeof setInterval> | null = null

function loadBuffer(): TelemetryEvent[] {
  try {
    const raw = localStorage.getItem(BUFFER_KEY)
    return raw ? JSON.parse(raw) as TelemetryEvent[] : []
  } catch {
    return []
  }
}

function saveBuffer(events: TelemetryEvent[]): void {
  try {
    localStorage.setItem(BUFFER_KEY, JSON.stringify(events.slice(-MAX_BUFFER)))
  } catch {
    // storage full — drop silently
  }
}

function scheduleFlush(): void {
  if (flushTimer) return
  flushTimer = setInterval(() => {
    void flush()
  }, FLUSH_INTERVAL_MS)
}

export function track(name: string, properties?: Record<string, unknown>): void {
  buffer.push({ name, properties, timestamp: Date.now() })
  if (buffer.length >= 20) {
    void flush()
  } else {
    scheduleFlush()
  }
}

export async function reportError(error: Error | string, context?: Record<string, unknown>): Promise<void> {
  const payload: ErrorReport = {
    message: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: Date.now(),
  }
  try {
    await apiClient.post('/telemetry/errors', payload)
  } catch {
    saveBuffer([...loadBuffer(), { name: 'error', properties: payload as unknown as Record<string, unknown> }])
  }
}

export async function flush(): Promise<void> {
  if (buffer.length === 0) return
  const batch = [...buffer]
  buffer = []
  try {
    await apiClient.post('/telemetry/events', { events: batch })
    localStorage.removeItem(BUFFER_KEY)
  } catch {
    saveBuffer([...loadBuffer(), ...batch])
  }
}

export function initTelemetry(): void {
  const pending = loadBuffer()
  if (pending.length > 0) {
    buffer = pending
  }
  scheduleFlush()
}
