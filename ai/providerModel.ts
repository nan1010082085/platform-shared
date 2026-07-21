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

/**
 * 模型能力类型。一个模型可具备多种能力，节点选模型时按能力过滤。
 * - chat: 文本对话 / LLM 推理（默认）
 * - image: 图像生成
 * - video: 视频生成
 * - audio: 音频转录 / 语音
 */
export type ModelCapability = 'chat' | 'image' | 'video' | 'audio'

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
  capabilities: ModelCapability[]
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ────────────────────────────────────────────
// 聚合类型
// ────────────────────────────────────────────

export type ProviderWithModels = Provider & { models: Model[] }
