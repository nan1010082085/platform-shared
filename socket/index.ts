/**
 * @socket — Socket.IO 客户端封装
 *
 * 提供实时通信能力，支持编辑器与 AI 应用之间的协作。
 * 使用 socket.io-client 连接服务端 Socket.IO。
 */

import { io, Socket } from 'socket.io-client'

// ---- 类型定义 ----

export interface FlowNotificationEvent {
  id: string
  userId: string
  type: string
  title: string
  content?: string
  relatedId?: string
  relatedType?: string
  isRead: boolean
  createdAt: string
}

export interface AiApplyEvent {
  type: 'schema' | 'flow'
  payload: unknown
  conversationId?: string
}

export interface AiPublishedEvent {
  type: 'schema' | 'flow'
  id: string
  publishId: string
  conversationId?: string
}

// ---- Socket 状态 ----

let socket: Socket | null = null
let connected = false
const connectionHandlers = new Set<(connected: boolean) => void>()
let tokenProvider: (() => string | null) | null = null
let pendingTokenListener: (() => void) | null = null

/** 注入 token 提供者（与 apiClient.setTokenProvider 用法一致） */
export function setSocketTokenProvider(provider: () => string | null): void {
  tokenProvider = provider
}

function getAuthToken(): string {
  return tokenProvider?.() ?? localStorage.getItem('sfp_access_token') ?? ''
}

function clearPendingTokenListener(): void {
  if (pendingTokenListener) {
    window.removeEventListener('storage', pendingTokenListener)
    pendingTokenListener = null
  }
}

function teardownSocket(): void {
  if (!socket) return
  socket.removeAllListeners()
  socket.disconnect()
  socket = null
  connected = false
  notifyConnectionChange()
}

/** 根据当前页面路径解析 Socket.IO path（生产走 /schema-platform/ws） */
export function resolveSocketPath(explicit?: string): string {
  if (explicit) return explicit
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/schema-platform')) {
    return '/schema-platform/ws'
  }
  return '/ws'
}

/** 订阅连接状态变化（立即回调当前状态） */
export function onConnectionChange(handler: (connected: boolean) => void): () => void {
  handler(connected)
  connectionHandlers.add(handler)
  return () => {
    connectionHandlers.delete(handler)
  }
}

function notifyConnectionChange(): void {
  for (const handler of connectionHandlers) {
    handler(connected)
  }
}

/** 获取当前连接状态 */
export function isConnected(): boolean {
  return connected
}

export interface SocketConnectOptions {
  /** 服务端地址，默认 window.location.origin */
  url?: string
  /** Socket.IO 路径，开发环境 /ws，生产环境 /schema-platform/ws */
  path?: string
}

// ---- 公共 API ----

/**
 * 建立 Socket.IO 连接
 *
 * @param opts - 可选配置，由调用方根据环境传入 url/path
 */
export function connect(opts?: SocketConnectOptions): void {
  if (socket?.connected) return

  const url = opts?.url ?? (typeof window !== 'undefined' ? window.location.origin : '')
  const path = resolveSocketPath(opts?.path)
  if (!url) return

  const token = getAuthToken()
  if (!token) {
    // 登录完成后再连；避免空 token 占住 singleton 导致永远无法重连
    if (typeof window !== 'undefined' && !pendingTokenListener) {
      pendingTokenListener = () => {
        if (!getAuthToken()) return
        clearPendingTokenListener()
        connect(opts)
      }
      window.addEventListener('storage', pendingTokenListener)
    }
    console.warn('[socket] deferred connect: no auth token')
    return
  }

  clearPendingTokenListener()
  teardownSocket()

  socket = io(url, {
    path,
    transports: ['websocket', 'polling'],
    auth: { token },
  })

  socket.on('connect', () => {
    connected = true
    console.log('[socket] connected')
    notifyConnectionChange()
  })

  socket.on('disconnect', () => {
    connected = false
    console.log('[socket] disconnected')
    notifyConnectionChange()
  })

  socket.on('connect_error', (err) => {
    console.warn('[socket] connection error:', err.message)
    // 认证失败时释放 singleton，允许后续用新 token 重连
    if (/authentication|token|expired/i.test(err.message)) {
      teardownSocket()
    }
  })
}

/** 断开连接 */
export function disconnect(): void {
  clearPendingTokenListener()
  teardownSocket()
}

/** 标识当前用户 */
export function identify(userId: string): void {
  if (socket && connected) {
    socket.emit('identify', { userId })
  }
}

// ---- 编辑器事件 ----

/** 监听 AI 应用事件 */
export function onAiApply(handler: (data: AiApplyEvent) => void): () => void {
  if (!socket) return () => {}
  socket.on('ai:apply', handler)
  return () => { socket?.off('ai:apply', handler) }
}

/** 监听 AI 发布事件 */
export function onAiPublished(handler: (data: AiPublishedEvent) => void): () => void {
  if (!socket) return () => {}
  socket.on('ai:published', handler)
  return () => { socket?.off('ai:published', handler) }
}

/** 发送 AI 应用事件 */
export function emitAiApply(data: AiApplyEvent): void {
  if (socket && connected) {
    socket.emit('ai:apply', data)
  }
}

/** 发送 AI 发布事件 */
export function emitAiPublished(data: AiPublishedEvent): void {
  if (socket && connected) {
    socket.emit('ai:published', data)
  }
}

// ---- 流程通知 ----

/** 监听流程通知 */
export function onFlowNotification(handler: (data: FlowNotificationEvent) => void): () => void {
  if (!socket) return () => {}
  socket.on('flow:notification', handler)
  return () => { socket?.off('flow:notification', handler) }
}

// ---- AI Chat (WebSocket 流式对话) ----

export interface ChatSendPayload {
  conversationId?: string
  message: string
  context: {
    source: string
    schemaId?: string
    flowId?: string
    nodeId?: string
    version?: string
    preferences?: Record<string, unknown>
    historySummary?: string
    currentSchema?: Record<string, unknown>[]
    currentFlow?: { nodes: Record<string, unknown>[]; edges: Record<string, unknown>[] }
    selectedWidget?: { id: string; type: string; field?: string; label?: string }
    editorMode?: 'edit' | 'preview'
  }
  mentions?: Array<{ id: string; type: string; name?: string; label?: string }>
}

export interface ChatEvent {
  threadId: string
  type: string
  agent?: string
  content?: string
  description?: string
  [key: string]: unknown
}

/** 发送聊天消息（启动流式响应） */
export function emitChatSend(data: ChatSendPayload): void {
  if (!socket) {
    console.error('[socket] emitChatSend: socket not initialized')
    return
  }
  socket.emit('chat:send', data)
}

/** 取消当前聊天流 */
export function emitChatCancel(): void {
  if (!socket) return
  socket.emit('chat:cancel')
}

/** 恢复 HITL 中断的对话 */
export function emitChatResume(threadId: string, resumeValue: boolean | Record<string, unknown>): void {
  if (!socket) return
  socket.emit('chat:resume', { threadId, resumeValue })
}

/** 监听聊天流事件 */
export function onChatEvent(handler: (data: ChatEvent) => void): () => void {
  if (!socket) return () => {}
  socket.on('chat:event', handler)
  return () => { socket?.off('chat:event', handler) }
}

// ---- Agent Workflow (WebSocket 执行进度) ----

export interface WorkflowExecutionPayload {
  id: string
  workflowId: string
  workflowName: string
  status: string
  nodeRecords?: unknown[]
  /** 向后兼容：最近一条流式输出（单一节点） */
  streamingOutput?: {
    nodeId: string
    nodeType: string
    text: string
    updatedAt: string
  } | null
  /** per-node streaming outputs map（多个节点可同时拥有流式文本） */
  streamingOutputs?: Record<string, {
    nodeType: string
    text: string
    updatedAt: string
  }> | null
  error?: string
  [key: string]: unknown
}

export interface WorkflowEvent {
  executionId: string
  execution: WorkflowExecutionPayload
}

/** 订阅工作流执行进度（需先 REST 启动执行并获得 executionId） */
export function emitWorkflowSubscribe(data: { executionId: string }): void {
  if (socket && connected) {
    socket.emit('workflow:subscribe', data)
  }
}

/** 取消订阅 */
export function emitWorkflowUnsubscribe(data: { executionId: string }): void {
  if (socket && connected) {
    socket.emit('workflow:unsubscribe', data)
  }
}

/** 监听工作流执行事件 */
export function onWorkflowEvent(handler: (data: WorkflowEvent) => void): () => void {
  if (!socket) return () => {}
  socket.on('workflow:event', handler)
  return () => { socket?.off('workflow:event', handler) }
}

/** 监听工作流错误 */
export function onWorkflowError(handler: (data: { executionId?: string; message: string }) => void): () => void {
  if (!socket) return () => {}
  socket.on('workflow:error', handler)
  return () => { socket?.off('workflow:error', handler) }
}

// ---- 工作流节点级事件（per-node streamingOutput + node-event）----

export interface WorkflowNodeEvent {
  executionId: string
  eventType: string
  nodeId?: string
  nodeType?: string
  text?: string
  [key: string]: unknown
}

/** 监听节点级事件（tool-call / streaming / progress） */
export function onWorkflowNodeEvent(handler: (data: WorkflowNodeEvent) => void): () => void {
  if (!socket) return () => {}
  socket.on('workflow:node-event', handler)
  return () => { socket?.off('workflow:node-event', handler) }
}
