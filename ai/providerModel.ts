/**
 * AI 模型提供商与模型类型定义
 *
 * 供 server API 和前端共享使用。
 */

// ────────────────────────────────────────────
// Provider（模型提供商）
// ────────────────────────────────────────────

export type ProviderType = 'openai' | 'anthropic' | 'custom'

export interface Provider {
  id: string
  name: string
  type: ProviderType
  baseUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/** API 返回时 apiKey 已脱敏，不暴露原始密钥 */
export interface ProviderWithMaskedKey extends Provider {
  apiKey: string | null
}

// ────────────────────────────────────────────
// Model（模型配置）
// ────────────────────────────────────────────

export interface ModelParameters {
  temperature?: number
  maxTokens?: number
  topP?: number
  [key: string]: unknown
}

export interface Model {
  id: string
  name: string
  providerId: string
  model: string
  parameters: ModelParameters
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ────────────────────────────────────────────
// 聚合类型
// ────────────────────────────────────────────

export type ProviderWithModels = Provider & { models: Model[] }
