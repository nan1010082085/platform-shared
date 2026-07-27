/**
 * Agent 工作流编排 — 领域类型（n8n 风格 DAG）
 */

export type ExpertNodeType = 'agent-intent' | 'expert'

export type AgentNodeType =
  | 'manual-trigger'
  | 'webhook-trigger'
  | 'document-parse'
  | 'vision-analyze'
  | 'audio-transcribe'
  | 'video-analyze'
  | 'conversation-memory'
  | 'llm'
  | ExpertNodeType
  | 'tool'
  | 'if'
  | 'hitl'
  | 'end'
  | 'image-generate'
  | 'video-generate'
  | 'ppt-generate'
  | 'intent-router'
  | 'summarizer'
  | 'requirement-analyzer'
  | 'task-planner'
  | 'task-chain'
  | 'collaboration-router'
  | 'agent-loop'
  | 'code-execute'
  | 'variable-set'
  | 'switch'
  | 'schedule-trigger'
  | 'agent-team'

export type AgentWorkflowStatus = 'draft' | 'published' | 'archived'

export type AgentExecutionStatus = 'running' | 'success' | 'error' | 'waiting' | 'cancelled'

export type AgentNodeRecordStatus =
  | 'pending'
  | 'running'
  | 'success'
  | 'error'
  | 'skipped'
  | 'waiting'

/** HITL 人工确认问题（与 Chat 需求分析 confirmQuestions 结构对齐） */
export interface AgentHitlConfirmQuestion {
  id: string
  question: string
  options?: string[]
  required?: boolean
}

export interface AgentConversationTurn {
  role: 'user' | 'assistant' | 'system'
  content: string
  at?: string
}

export interface AgentWorkflowNodeData {
  label: string
  /** llm */
  prompt?: string
  model?: string
  systemPrompt?: string
  useConversationHistory?: boolean
  maxHistoryTurns?: number
  appendAssistantReply?: boolean
  /** agent */
  agentType?: 'auto' | 'editor' | 'flow' | 'page' | 'general'
  /** expert — 插件中心专家 id */
  expertId?: string
  /** tool */
  toolCategory?:
    | 'mcp-schema'
    | 'mcp-flow'
    | 'mcp-widget'
    | 'mcp-rag'
    | 'mcp-industry'
    | 'langgraph'
    | 'workflow'
  toolName?: string
  toolArgs?: Record<string, unknown>
  /** if */
  expression?: string
  /** hitl */
  confirmMessage?: string
  confirmQuestions?: AgentHitlConfirmQuestion[]
  inheritUpstreamQuestions?: boolean
  /** webhook-trigger */
  webhookPath?: string
  webhookMethod?: 'GET' | 'POST'
  /** 发布时生成，用于 HMAC 验签 */
  webhookSecret?: string
  /** schedule-trigger：cron 表达式（5 字段：分 时 日 月 周） */
  scheduleCron?: string
  /** schedule-trigger：时区，默认 Asia/Shanghai */
  scheduleTimezone?: string
  /** schedule-trigger：是否启用 */
  scheduleEnabled?: boolean
  /** document-parse / vision-analyze */
  documentSource?: 'documentId' | 'inputField' | 'stream' | 'api'
  documentId?: string
  inputField?: string
  /** stream 来源：从 $input 读取文件对象字段，默认 file；支持 base64 或 documentId 引用 */
  streamField?: string
  /** api 来源：HTTP 查询接口 */
  fetchUrl?: string
  fetchMethod?: 'GET' | 'POST'
  fetchHeaders?: Record<string, string>
  fetchBody?: string
  /** binary=响应体即文件；json-base64=JSON 字段 base64；json-url=JSON 字段为下载 URL */
  fetchResponseMode?: 'binary' | 'json-base64' | 'json-url'
  fetchContentPath?: string
  fetchFilenamePath?: string
  fetchMimetypePath?: string
  fetchFilename?: string
  fetchMimetype?: string
  /** vision-analyze */
  visionPrompt?: string
  /** vision-analyze 图片预处理：压缩宽度（px），不设置则不压缩 */
  visionImageWidth?: number
  /** vision-analyze 图片预处理：JPEG 质量 1-100，不设置则不压缩 */
  visionImageQuality?: number
  /** image-generate */
  imagePrompt?: string
  imageModel?: 'dall-e-3' | 'dall-e-2' | 'mimo-image'
  imageSize?: '1024x1024' | '1024x1792' | '1792x1024'
  imageStyle?: 'natural' | 'vivid'
  imageQuality?: 'standard' | 'hd'
  /** image-generate 内部预览状态（非持久化，仅运行时） */
  _previewImageUrl?: string
  _previewLoading?: boolean
  _previewError?: string
  /** ppt-generate */
  pptTemplate?: 'business' | 'tech' | 'education' | 'creative'
  pptMaxSlides?: number
  pptStyle?: 'professional' | 'casual' | 'academic'
  pptIncludeImages?: boolean
  /** conversation-memory */
  memoryMode?: 'read' | 'append' | 'reset'
  memoryRole?: 'user' | 'assistant'
  messageField?: string
  contentSource?: 'input' | 'lastOutput'
  /** end — 输出配置 */
  /** 输出来源：lastOutput=最后一个节点输出，node=指定节点，custom=自定义JSON */
  outputSource?: 'lastOutput' | 'node' | 'custom'
  /** outputSource=node 时，指定节点 ID */
  outputNodeId?: string
  /** outputSource=custom 时的自定义 JSON 模板 */
  outputTemplate?: string
  /** intent-router */
  routingMode?: 'auto' | 'explicit'
  enableMultiIntentChain?: boolean
  fallbackExpertId?: string
  /** summarizer */
  summarySource?: 'taskChain' | 'custom'
  customPrompt?: string
  stream?: boolean
  /** requirement-analyzer */
  enableRag?: boolean
  enableTools?: boolean
  completenessThreshold?: number
  /** task-planner */
  inputSource?: 'message' | 'requirementAnalysis'
  maxSteps?: number
  strategy?: 'sequential' | 'mixed'
  /** task-chain */
  chainSource?: 'upstream' | 'static'
  staticChain?: TaskPlanStep[]
  onStepOutput?: string
  /** collaboration-router */
  detectCollaborationTool?: boolean
  maxCollaborationRounds?: number
  /** agent-loop：LLM 自主循环调工具，让 workflow 段落具备智能体能力 */
  /** 可用工具名列表（对应图内 tool 节点声明的工具名，或已注册的 langgraph 工具） */
  agentLoopTools?: string[]
  /** 最大自主迭代次数（硬上限，防止失控），默认 8 */
  agentLoopMaxIterations?: number
  /** agent-loop 系统提示（角色/约束），默认通用助手 */
  agentLoopSystemPrompt?: string
  /** agent-loop 输入来源：message=工作流输入 message，lastOutput=上游节点输出，custom=自定义 */
  agentLoopInputSource?: 'message' | 'lastOutput' | 'custom'
  /** agentLoopInputSource=custom 时的模板 */
  agentLoopInputTemplate?: string
  /** agent-loop 工具调用总次数硬上限（防 token 失控），默认 50 */
  agentLoopMaxToolInvocations?: number
  /** agent-team：团队成员列表 */
  agentTeamMembers?: Array<{
    name: string
    persona: string
    model?: string
    tools?: string[]
  }>
  /** agent-team：协作模式 */
  agentTeamMode?: 'sequential' | 'discussion'
  /** agent-team：最大 supervisor 轮次 */
  agentTeamMaxRounds?: number
  /** agent-team：supervisor 模型 */
  agentTeamModel?: string
  /** agent-team：supervisor 系统提示 */
  agentTeamSystemPrompt?: string
  /** code-execute: JavaScript 代码（沙箱执行） */
  codeLanguage?: 'javascript'
  codeScript?: string
  /** variable-set: 设置/更新工作流变量 */
  variableName?: string
  variableValue?: string
  variableMode?: 'set' | 'append' | 'increment'
  /** switch: 多路条件分支 */
  switchBranches?: Array<{ label: string; expression: string }>
  notes?: string
}

/** 图片生成节点专用数据子集（用于类型安全的参数传递） */
export interface ImageGenerateNodeData {
  label: string
  imagePrompt: string
  /** 模型标识（来自模型中心配置，如 dall-e-3 / mimo-image / 自定义 id） */
  imageModel: string
  imageSize: '1024x1024' | '1024x1792' | '1792x1024'
  imageStyle: 'natural' | 'vivid'
  imageQuality: 'standard' | 'hd'
  /** 生成图片数量（1-10），默认 1 */
  imageCount?: number
}

/** video-generate 节点：文生视频，节点内置异步轮询直到完成 */
export interface VideoGenerateNodeData {
  label: string
  videoPrompt: string
  /** 模型标识（来自模型中心，具备 video 能力的模型） */
  videoModel: string
  /** 视频时长（秒），典型 6-15s */
  duration?: number
  /** 分辨率 */
  resolution?: '480p' | '720p' | '1080p'
  /** 轮询间隔（毫秒），默认 5000 */
  pollIntervalMs?: number
  /** 最大轮询时长（毫秒），默认 300000（5 分钟） */
  pollTimeoutMs?: number
}

/** 任务计划步骤（与 server 端 TaskPlanStep 对齐） */
export interface TaskPlanStep {
  id: string
  agent: 'editor' | 'flow' | 'page'
  description: string
  inputs: Record<string, unknown>
  outputs: Record<string, unknown>
  dependencies: string[]
  priority: number
  status: 'pending' | 'running' | 'done' | 'error'
}

/** 意图路由节点 */
export interface IntentRouterNodeData {
  label: string
  routingMode: 'auto' | 'explicit'
  enableMultiIntentChain: boolean
  fallbackExpertId: string
}

/** 摘要节点 */
export interface SummarizerNodeData {
  label: string
  summarySource: 'taskChain' | 'custom'
  customPrompt: string
  stream: boolean
  model: string
}

/** 需求分析节点 */
export interface RequirementAnalyzerNodeData {
  label: string
  enableRag: boolean
  enableTools: boolean
  completenessThreshold: number
  model: string
}

/** 任务规划节点 */
export interface TaskPlannerNodeData {
  label: string
  inputSource: 'message' | 'requirementAnalysis'
  maxSteps: number
  strategy: 'sequential' | 'mixed'
  model: string
}

/** 任务链节点 */
export interface TaskChainNodeData {
  label: string
  chainSource: 'upstream' | 'static'
  staticChain: TaskPlanStep[]
  onStepOutput: string
}

/** 协作路由节点 */
export interface CollaborationRouterNodeData {
  label: string
  detectCollaborationTool: boolean
  maxCollaborationRounds: number
}

export interface AgentWorkflowNode {
  id: string
  type: AgentNodeType
  position: { x: number; y: number }
  data: AgentWorkflowNodeData
}

export interface AgentWorkflowEdge {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  data?: {
    label?: string
    branch?: 'true' | 'false' | 'default'
  }
}

export interface AgentWorkflowGraph {
  nodes: AgentWorkflowNode[]
  edges: AgentWorkflowEdge[]
  entryNodeId: string
  viewport?: { x: number; y: number; zoom: number }
}

export interface AgentWorkflowSummary {
  id: string
  name: string
  /** 租户内唯一 slug，Open API by-slug 执行 */
  slug?: string | null
  description?: string
  status: AgentWorkflowStatus
  /** 当前草稿版本号 (yyyymmddhhmmss) */
  version: string
  /** 稳定发布 ID (UUID) */
  publishId: string | null
  /** 已发布版本号 (yyyymmddhhmmss) */
  publishedVersion: string | null
  /** 可路由关键词：chat 意图匹配时建议使用此工作流 */
  routingKeywords?: string[]
  /** 是否有执行中的实例 */
  hasRunningExecution: boolean
  updatedAt: string
  createdAt: string
}

export interface AgentWorkflowDetail extends AgentWorkflowSummary {
  draftGraph: AgentWorkflowGraph
  onCompleteWebhook?: { url: string; secret?: string } | null
  /** 脱敏后的调用密钥 */
  invokeKeyMasked?: string | null
  /** 统一调用路径，如 /api/ai/workflows/invoke/my-slug */
  invokePath?: string | null
}

export interface AgentWorkflowPublishResult {
  publishId: string
  version: string
  slug?: string | null
  /** 完整密钥，仅在发布/轮换时返回一次 */
  invokeKey?: string | null
}

export interface AgentWorkflowVersionEntry {
  version: string
  createdAt: string
  published: boolean
  current: boolean
}

export interface AgentWorkflowVersionDetail {
  version: string
  graph: AgentWorkflowGraph
  createdAt: string
  current: boolean
}

export interface AgentNodeRecord {
  nodeId: string
  nodeType: AgentNodeType
  nodeName: string
  status: AgentNodeRecordStatus
  startedAt?: string
  finishedAt?: string
  durationMs?: number
  input?: unknown
  output?: unknown
  error?: string
}

export interface AgentWorkflowStreamingOutput {
  nodeId: string
  nodeType: string
  text: string
  updatedAt: string
}

export interface AgentWorkflowExecution {
  id: string
  workflowId: string
  workflowName: string
  versionId: string | null
  version: string
  status: AgentExecutionStatus
  trigger: 'manual' | 'chat' | 'webhook' | 'api' | 'schedule'
  startedAt: string
  finishedAt?: string
  durationMs?: number
  nodeRecords: AgentNodeRecord[]
  conversationHistory?: AgentConversationTurn[]
  parentExecutionId?: string | null
  error?: string
  streamingOutput?: AgentWorkflowStreamingOutput | null
}

export interface AgentWorkflowValidationIssue {
  level: 'error' | 'warning'
  nodeId?: string
  message: string
}
