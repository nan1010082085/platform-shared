/**
 * Agent 工作流编排 — 领域类型（n8n 风格 DAG）
 */

export type ExpertNodeType = 'agent-intent' | 'expert'

export type AgentNodeType =
  | 'manual-trigger'
  | 'webhook-trigger'
  | 'document-parse'
  | 'vision-analyze'
  | 'conversation-memory'
  | 'llm'
  | ExpertNodeType
  | 'tool'
  | 'if'
  | 'hitl'
  | 'end'
  | 'image-generate'
  | 'ppt-generate'
  | 'intent-router'
  | 'summarizer'
  | 'requirement-analyzer'
  | 'task-planner'
  | 'task-chain'
  | 'collaboration-router'

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
  notes?: string
}

/** 图片生成节点专用数据子集（用于类型安全的参数传递） */
export interface ImageGenerateNodeData {
  label: string
  imagePrompt: string
  imageModel: 'dall-e-3' | 'dall-e-2' | 'mimo-image'
  imageSize: '1024x1024' | '1024x1792' | '1792x1024'
  imageStyle: 'natural' | 'vivid'
  imageQuality: 'standard' | 'hd'
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
  trigger: 'manual' | 'chat' | 'webhook' | 'api'
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

export function createDefaultAgentWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 200 },
        data: { label: '手动触发' },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: { label: 'LLM', prompt: '{{$input.message}}', model: 'default' },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 560, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'llm-1' },
      { id: 'e2', source: 'llm-1', target: 'end-1' },
    ],
  })
}

/** 按节点类型生成默认 NodeData（设计器拖入节点时使用） */
export function createDefaultNodeData(type: AgentNodeType): AgentWorkflowNodeData {
  const base: AgentWorkflowNodeData = { label: type }
  switch (type) {
    case 'intent-router':
      return {
        ...base,
        label: '意图路由',
        routingMode: 'auto',
        enableMultiIntentChain: false,
        fallbackExpertId: '',
      } as AgentWorkflowNodeData
    case 'summarizer':
      return {
        ...base,
        label: '摘要',
        summarySource: 'taskChain',
        customPrompt: '',
        stream: false,
        model: 'default',
      } as AgentWorkflowNodeData
    case 'requirement-analyzer':
      return {
        ...base,
        label: '需求分析',
        enableRag: true,
        enableTools: true,
        completenessThreshold: 80,
        model: 'default',
      } as AgentWorkflowNodeData
    case 'task-planner':
      return {
        ...base,
        label: '任务规划',
        inputSource: 'message',
        maxSteps: 8,
        strategy: 'sequential',
        model: 'default',
      } as AgentWorkflowNodeData
    case 'task-chain':
      return {
        ...base,
        label: '任务链',
        chainSource: 'upstream',
        staticChain: [],
        onStepOutput: '',
      } as AgentWorkflowNodeData
    case 'collaboration-router':
      return {
        ...base,
        label: '协作路由',
        detectCollaborationTool: true,
        maxCollaborationRounds: 3,
      } as AgentWorkflowNodeData
    default:
      return base
  }
}

const AGENT_NODE_LAYOUT_STEP_X = 340
const AGENT_NODE_LAYOUT_STEP_Y = 180
const AGENT_NODE_LAYOUT_BASE_X = 80
const AGENT_NODE_LAYOUT_BASE_Y = 200

/** 按 DAG 层级自动拉开节点间距，避免宽节点卡片重叠 */
export function layoutAgentWorkflowGraph(graph: AgentWorkflowGraph): AgentWorkflowGraph {
  if (!graph.nodes.length) return graph

  const levels = new Map<string, number>()
  for (const node of graph.nodes) levels.set(node.id, 0)
  if (graph.entryNodeId && levels.has(graph.entryNodeId)) {
    levels.set(graph.entryNodeId, 0)
  }

  let changed = true
  let guard = 0
  while (changed && guard < graph.nodes.length + graph.edges.length + 4) {
    changed = false
    guard += 1
    for (const edge of graph.edges) {
      const next = (levels.get(edge.source) ?? 0) + 1
      if (next > (levels.get(edge.target) ?? 0)) {
        levels.set(edge.target, next)
        changed = true
      }
    }
  }

  const byLevel = new Map<number, string[]>()
  for (const node of graph.nodes) {
    const level = levels.get(node.id) ?? 0
    const bucket = byLevel.get(level) ?? []
    bucket.push(node.id)
    byLevel.set(level, bucket)
  }

  for (const ids of byLevel.values()) {
    ids.sort((a, b) => {
      const ay = graph.nodes.find((n) => n.id === a)?.position.y ?? 0
      const by = graph.nodes.find((n) => n.id === b)?.position.y ?? 0
      return ay - by || a.localeCompare(b)
    })
  }

  return {
    ...graph,
    nodes: graph.nodes.map((node) => {
      const level = levels.get(node.id) ?? 0
      const peers = byLevel.get(level) ?? [node.id]
      const peerIndex = peers.indexOf(node.id)
      const peerCount = peers.length
      const yOffset = (peerIndex - (peerCount - 1) / 2) * AGENT_NODE_LAYOUT_STEP_Y
      return {
        ...node,
        position: {
          x: AGENT_NODE_LAYOUT_BASE_X + level * AGENT_NODE_LAYOUT_STEP_X,
          y: AGENT_NODE_LAYOUT_BASE_Y + yOffset,
        },
      }
    }),
  }
}

/** 文档解析 + 摘要工作流模板（Webhook → 解析 → LLM 摘要 → 结束） */
export function createDocumentSummaryWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/document-summary',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '文档解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '生成摘要',
          model: 'default',
          systemPrompt: '你是文档摘要助手，请根据解析后的文档内容生成简洁的中文摘要。',
          prompt: '请为以下文档生成结构化摘要：\n\n文件名：{{$node.parse-1.filename}}\n\n正文：\n{{$node.parse-1.text}}',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 800, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'end-1' },
    ],
  })
}

/** 文档 / 图片识别编排：上传文件流 → 解析 → 按 OCR/文档分支结构化提取 */
export function createDocImageRecognitionWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 220 },
        data: { label: '手动触发' },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 280, y: 220 },
        data: {
          label: '文档/图片解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 480, y: 220 },
        data: {
          label: '是否图片 OCR',
          expression: "lastOutput && lastOutput.extractionMethod === 'ocr'",
        },
      },
      {
        id: 'vision-1',
        type: 'vision-analyze',
        position: { x: 680, y: 120 },
        data: {
          label: '图片视觉描述',
          documentSource: 'stream',
          streamField: 'file',
          visionPrompt:
            '描述图片中的场景、UI/表单布局、图表与视觉结构。文字内容可简要概括，重点不是逐字 OCR。',
        },
      },
      {
        id: 'llm-image',
        type: 'llm',
        position: { x: 880, y: 120 },
        data: {
          label: '图片结构化识别',
          model: 'default',
          systemPrompt:
            '你是图片识别助手。结合 OCR 文本与视觉描述，输出 JSON：{ "type": "image", "filename": "...", "summary": "...", "visualDescription": "...", "fields": [], "tables": [] }。只输出 JSON。',
          prompt:
            'OCR 文本：{{$node.parse-1.text}}\n\n视觉描述：{{$node.vision-1.description}}\n\n请输出结构化 JSON。',
        },
      },
      {
        id: 'llm-doc',
        type: 'llm',
        position: { x: 680, y: 320 },
        data: {
          label: '文档结构化提取',
          model: 'default',
          systemPrompt:
            '你是文档解析助手。根据文档正文，输出 JSON：{ "type": "document", "filename": "...", "summary": "...", "sections": [{"title":"","content":""}], "keyPoints": [] }。只输出 JSON，不要 markdown 代码块。',
          prompt:
            '文件名：{{$node.parse-1.filename}}\n\n解析结果：\n{{$node.parse-1.text}}\n\n请提取章节摘要与关键信息。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1080, y: 220 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'if-1' },
      { id: 'e3', source: 'if-1', target: 'vision-1', data: { branch: 'true' } },
      { id: 'e4', source: 'if-1', target: 'llm-doc', data: { branch: 'false' } },
      { id: 'e5', source: 'vision-1', target: 'llm-image' },
      { id: 'e6', source: 'llm-image', target: 'end-1' },
      { id: 'e7', source: 'llm-doc', target: 'end-1' },
    ],
  })
}

/** 智能助手问答编排：用户提问 → RAG 检索 → LLM 生成回答 */
export function createIntelligentAssistantWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 200 },
        data: { label: '手动触发' },
      },
      {
        id: 'memory-1',
        type: 'conversation-memory',
        position: { x: 240, y: 200 },
        data: {
          label: '记录用户问题',
          memoryMode: 'append',
          memoryRole: 'user',
          messageField: 'message',
          maxHistoryTurns: 20,
        },
      },
      {
        id: 'rag-1',
        type: 'tool',
        position: { x: 400, y: 200 },
        data: {
          label: '知识库检索',
          toolCategory: 'mcp-rag',
          toolName: 'rag__search',
          toolArgs: {
            query: '{{$input.message}}',
            limit: 5,
          },
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 600, y: 200 },
        data: {
          label: '生成回答',
          model: 'default',
          useConversationHistory: true,
          appendAssistantReply: true,
          maxHistoryTurns: 20,
          systemPrompt:
            '你是 Schema 平台智能助手。根据知识库检索结果与对话历史回答用户问题，语气简洁专业。若检索无相关内容，说明未找到并给出可操作建议。回答使用中文。',
          prompt:
            '对话历史：\n{{$conversation}}\n\n当前问题：{{$input.message}}\n\n知识库检索结果：\n{{$node.rag-1}}\n\n请给出完整回答。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 800, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'memory-1' },
      { id: 'e2', source: 'memory-1', target: 'rag-1' },
      { id: 'e3', source: 'rag-1', target: 'llm-1' },
      { id: 'e4', source: 'llm-1', target: 'end-1' },
    ],
  })
}

export type AgentWorkflowTemplateId =
  | 'blank'
  | 'document-summary'
  | 'doc-image-recognition'
  | 'intelligent-assistant'
  | 'contract-extract'
  | 'kb-faq'
  | 'http-notify'
  | 'rag-ingest-qa'
  | 'multi-doc-batch'
  | 'smart-suggestions'
  | 'smart-action-proposals'
  | 'image-text-generation'
  | 'ppt-generation'
  | 'image-analysis'
  | 'chat-parity-assistant'
  | 'requirement-gated-build'

export interface AgentWorkflowTemplateMeta {
  id: AgentWorkflowTemplateId
  name: string
  description: string
  category: 'general' | 'document' | 'assistant' | 'integration' | 'batch'
  icon?: string
  tags?: string[]
}

export const AGENT_WORKFLOW_TEMPLATES: AgentWorkflowTemplateMeta[] = [
  {
    id: 'blank',
    name: '空白工作流',
    description: '手动触发 + LLM + 结束，从零开始搭建',
    category: 'general',
  },
  {
    id: 'document-summary',
    name: '文档摘要',
    description: 'Webhook 接收 documentId，解析后生成摘要',
    category: 'document',
  },
  {
    id: 'doc-image-recognition',
    name: '文档 / 图片识别',
    description: '解析上传文件，图片走 OCR 分支，文档走结构化提取',
    category: 'document',
  },
  {
    id: 'intelligent-assistant',
    name: '智能助手问答',
    description: 'RAG 检索知识库后由 LLM 生成帮助回答',
    category: 'assistant',
  },
  {
    id: 'contract-extract',
    name: '合同条款提取',
    description: '上传合同文档，解析后由 LLM 结构化提取关键条款与风险点',
    category: 'document',
  },
  {
    id: 'kb-faq',
    name: '知识库 FAQ 生成',
    description: 'Webhook 接收文档，由 LLM 自动生成问答对并写入知识库',
    category: 'assistant',
  },
  {
    id: 'http-notify',
    name: 'HTTP 回调通知',
    description: 'Webhook 接收数据 → LLM 处理 → HTTP POST 结果到外部系统',
    category: 'integration',
  },
  {
    id: 'rag-ingest-qa',
    name: 'RAG 入库质检',
    description: '文档解析后经 LLM 质检，合格文档自动入库，不合格触发人工审核',
    category: 'assistant',
  },
  {
    id: 'multi-doc-batch',
    name: '多文档批量处理',
    description: 'Webhook 接收文档，解析后由 LLM 生成摘要并汇总结果（多次调用可累积）',
    category: 'batch',
  },
  {
    id: 'smart-suggestions',
    name: '智能建议',
    description: '根据用户操作上下文，AI 主动推荐下一步操作、优化方案、相关 Schema/Flow',
    category: 'assistant',
  },
  {
    id: 'smart-action-proposals',
    name: '智能拟办',
    description: '从文档/对话中提取行动项，自动生成待办事项、审批流程、任务分配方案',
    category: 'document',
  },
  {
    id: 'image-text-generation',
    name: '图文生成',
    description: '根据用户描述生成配图+文案的组合内容（公众号文章、产品介绍、营销素材）',
    category: 'general',
  },
  {
    id: 'ppt-generation',
    name: 'PPT 生成',
    description: '根据用户描述或文档内容，AI 自动生成演示文稿（结构+内容+配图）',
    category: 'general',
  },
  {
    id: 'image-analysis',
    name: '图片智能分析',
    description: '图片分析 → 结构化提取（日期/分类/地点）→ 根据类型生成情感/事件/信息微叙事',
    category: 'document',
  },
  {
    id: 'chat-parity-assistant',
    name: '智能助手 v2',
    description: '意图路由 → 需求分析 → 人工确认 → 任务规划 → 多专家协作 → 摘要输出，支持快捷匹配与协作循环',
    category: 'assistant',
    icon: 'chat-dot-round',
    tags: ['assistant', 'multi-agent'],
  },
  {
    id: 'requirement-gated-build',
    name: '需求门控构建',
    description: '需求分析 → 人工确认 → 任务规划 → 编辑器专家 → 流程专家 → 摘要输出，按需求门控逐步构建',
    category: 'assistant',
    icon: 'checked',
    tags: ['requirement', 'gated', 'multi-step'],
  },
]

/** 合同条款提取：Webhook 接收合同文档 → 解析 → LLM 结构化提取 → 结束 */
export function createContractExtractWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/contract-extract',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '合同文档解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '条款结构化提取',
          model: 'default',
          systemPrompt:
            '你是合同分析专家。从合同文本中提取关键条款，输出 JSON：{ "parties": [], "effectiveDate": "", "expiryDate": "", "totalAmount": "", "paymentTerms": "", "keyClauses": [{"clause": "", "content": "", "riskLevel": "low|medium|high"}], "risks": [] }。只输出 JSON，不要 markdown 代码块。',
          prompt:
            '文件名：{{$node.parse-1.filename}}\n\n合同正文：\n{{$node.parse-1.text}}\n\n请提取所有关键条款与潜在风险点。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 800, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'end-1' },
    ],
  })
}

/** 知识库 FAQ 生成：手动触发 → 文档解析 → LLM 生成问答对 → RAG 写入 → 结束 */
export function createKbFaqWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/kb-faq',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '文档解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '生成 FAQ 问答对',
          model: 'default',
          systemPrompt:
            '你是知识库内容专家。根据文档内容生成高质量的 FAQ 问答对。输出 JSON 数组：[{ "question": "...", "answer": "..." }]。问题应覆盖文档核心知识点，答案简洁准确。生成 5~15 对。只输出 JSON。',
          prompt:
            '文档标题：{{$node.parse-1.filename}}\n\n文档内容：\n{{$node.parse-1.text}}\n\n请生成 FAQ 问答对。',
        },
      },
      {
        id: 'rag-write',
        type: 'tool',
        position: { x: 800, y: 200 },
        data: {
          label: '写入知识库',
          toolCategory: 'mcp-rag',
          toolName: 'rag__ingest',
          toolArgs: {
            content: '{{$node.llm-1}}',
            metadata: { source: 'faq-generated', filename: '{{$node.parse-1.filename}}' },
          },
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1040, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'rag-write' },
      { id: 'e4', source: 'rag-write', target: 'end-1' },
    ],
  })
}

/** HTTP 回调通知：手动触发 → LLM 处理 → HTTP POST 结果 → 结束 */
export function createHttpNotifyWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/process-and-notify',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '内容处理',
          model: 'default',
          systemPrompt: '你是数据处理助手。对输入内容进行分析和摘要，输出结构化 JSON 结果。',
          prompt: '请处理以下输入并输出结构化结果：\n\n{{$input}}',
        },
      },
      {
        id: 'notify-1',
        type: 'tool',
        position: { x: 560, y: 200 },
        data: {
          label: 'HTTP 回调通知',
          toolCategory: 'workflow',
          toolName: 'http__request',
          toolArgs: {
            url: '{{$input.callbackUrl}}',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
              workflowId: '{{$execution.workflowId}}',
              status: 'completed',
              result: '{{$node.llm-1}}',
              timestamp: '{{$now}}',
            },
          },
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 800, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'llm-1' },
      { id: 'e2', source: 'llm-1', target: 'notify-1' },
      { id: 'e3', source: 'notify-1', target: 'end-1' },
    ],
  })
}

/** RAG 入库质检：Webhook 接收文档 → 解析 → LLM 质检 → 判断是否合格 → 合格入库 / 不合格人工审核 */
export function createRagIngestQaWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/rag-ingest-qa',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '文档解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-qa',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '内容质量检查',
          model: 'default',
          systemPrompt:
            '你是文档质检员。检查文档内容是否适合入库：内容是否完整、是否有实质信息、是否为乱码或空白。输出 JSON：{ "passed": true/false, "reason": "..." }。只输出 JSON。',
          prompt:
            '文件名：{{$node.parse-1.filename}}\n\n文档内容：\n{{$node.parse-1.text}}\n\n请判断该文档是否适合写入知识库。',
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 800, y: 200 },
        data: {
          label: '质检是否通过',
          expression: "lastOutput && lastOutput.passed === true",
        },
      },
      {
        id: 'rag-ingest',
        type: 'tool',
        position: { x: 1040, y: 100 },
        data: {
          label: '写入知识库',
          toolCategory: 'mcp-rag',
          toolName: 'rag__ingest',
          toolArgs: {
            content: '{{$node.parse-1.text}}',
            metadata: { source: 'qa-passed', filename: '{{$node.parse-1.filename}}' },
          },
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 1040, y: 300 },
        data: {
          label: '人工审核',
          confirmMessage: '文档「{{$node.parse-1.filename}}」质检未通过，原因：{{$node.llm-qa.reason}}。请确认是否仍要入库？',
          confirmQuestions: [
            { id: 'q1', question: '是否强制入库？', options: ['入库', '丢弃'], required: true },
            { id: 'q2', question: '备注说明', required: false },
          ],
        },
      },
      {
        id: 'if-hitl',
        type: 'if',
        position: { x: 1280, y: 300 },
        data: {
          label: '用户选择',
          expression: "hitlResult && hitlResult.q1 === '入库'",
        },
      },
      {
        id: 'rag-ingest-force',
        type: 'tool',
        position: { x: 1520, y: 250 },
        data: {
          label: '强制入库',
          toolCategory: 'mcp-rag',
          toolName: 'rag__ingest',
          toolArgs: {
            content: '{{$node.parse-1.text}}',
            metadata: { source: 'qa-manual-override', filename: '{{$node.parse-1.filename}}' },
          },
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1520, y: 400 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-qa' },
      { id: 'e3', source: 'llm-qa', target: 'if-1' },
      { id: 'e4', source: 'if-1', target: 'rag-ingest', data: { branch: 'true' } },
      { id: 'e5', source: 'if-1', target: 'hitl-1', data: { branch: 'false' } },
      { id: 'e6', source: 'rag-ingest', target: 'end-1' },
      { id: 'e7', source: 'hitl-1', target: 'if-hitl' },
      { id: 'e8', source: 'if-hitl', target: 'rag-ingest-force', data: { branch: 'true' } },
      { id: 'e9', source: 'if-hitl', target: 'end-1', data: { branch: 'false' } },
      { id: 'e10', source: 'rag-ingest-force', target: 'end-1' },
    ],
  })
}

/** 多文档批量处理：Webhook 接收文档列表 → 解析 → LLM 摘要 → 汇总 → 结束 */
export function createMultiDocBatchWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/multi-doc-batch',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '文档解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-single',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '单文档摘要',
          model: 'default',
          systemPrompt: '你是文档摘要助手。为每篇文档生成简洁的中文摘要，提取关键信息。输出 JSON：{ "filename": "...", "summary": "...", "keyPoints": [] }。只输出 JSON。',
          prompt:
            '文件名：{{$node.parse-1.filename}}\n\n文档内容：\n{{$node.parse-1.text}}\n\n请生成摘要。',
        },
      },
      {
        id: 'memory-1',
        type: 'conversation-memory',
        position: { x: 800, y: 200 },
        data: {
          label: '追加摘要到记忆',
          memoryMode: 'append',
          memoryRole: 'assistant',
          contentSource: 'lastOutput',
          maxHistoryTurns: 50,
        },
      },
      {
        id: 'llm-summary',
        type: 'llm',
        position: { x: 1040, y: 200 },
        data: {
          label: '汇总所有摘要',
          model: 'default',
          systemPrompt: '你是文档汇总助手。根据已处理的所有文档摘要，生成一份综合报告。输出 JSON：{ "totalDocuments": N, "summaries": [...], "overallSummary": "...", "commonThemes": [] }。只输出 JSON。',
          prompt: '已处理的文档摘要：\n{{$conversation}}\n\n请生成综合汇总报告。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1280, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-single' },
      { id: 'e3', source: 'llm-single', target: 'memory-1' },
      { id: 'e4', source: 'memory-1', target: 'llm-summary' },
      { id: 'e5', source: 'llm-summary', target: 'end-1' },
    ],
  })
}

export function createAgentWorkflowGraphByTemplate(
  templateId: AgentWorkflowTemplateId,
): AgentWorkflowGraph {
  switch (templateId) {
    case 'document-summary':
      return createDocumentSummaryWorkflowGraph()
    case 'doc-image-recognition':
      return createDocImageRecognitionWorkflowGraph()
    case 'intelligent-assistant':
      return createIntelligentAssistantWorkflowGraph()
    case 'contract-extract':
      return createContractExtractWorkflowGraph()
    case 'kb-faq':
      return createKbFaqWorkflowGraph()
    case 'http-notify':
      return createHttpNotifyWorkflowGraph()
    case 'rag-ingest-qa':
      return createRagIngestQaWorkflowGraph()
    case 'multi-doc-batch':
      return createMultiDocBatchWorkflowGraph()
    case 'smart-suggestions':
      return createSmartSuggestionsWorkflowGraph()
    case 'smart-action-proposals':
      return createSmartActionProposalsWorkflowGraph()
    case 'image-text-generation':
      return createImageTextGenerationWorkflowGraph()
    case 'ppt-generation':
      return createPptGenerationWorkflowGraph()
    case 'image-analysis':
      return createImageAnalysisWorkflowGraph()
    case 'chat-parity-assistant':
      return createChatParityAssistantWorkflowGraph()
    case 'requirement-gated-build':
      return createRequirementGatedBuildWorkflowGraph()
    case 'blank':
    default:
      return createDefaultAgentWorkflowGraph()
  }
}

/** 智能建议：收集上下文 → LLM 分析 → 条件判断 → HITL 确认 / 直接结束 */
export function createSmartSuggestionsWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 200 },
        data: { label: '手动触发' },
      },
      {
        id: 'memory-1',
        type: 'conversation-memory',
        position: { x: 280, y: 200 },
        data: {
          label: '读取上下文',
          memoryMode: 'read',
          maxHistoryTurns: 10,
        },
      },
      {
        id: 'rag-1',
        type: 'tool',
        position: { x: 480, y: 200 },
        data: {
          label: '检索相关 Schema',
          toolCategory: 'mcp-rag',
          toolName: 'rag__search',
          toolArgs: {
            query: '{{$input.message}}',
            limit: 5,
          },
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 680, y: 200 },
        data: {
          label: '生成智能建议',
          model: 'default',
          useConversationHistory: true,
          maxHistoryTurns: 10,
          systemPrompt:
            '你是 Schema 平台智能助手。根据用户当前操作上下文、对话历史和检索到的相关 Schema/Flow，主动推荐下一步操作、优化方案或相关内容。\n\n输出 JSON：\n{\n  "suggestions": [\n    {\n      "type": "action|optimization|reference",\n      "title": "建议标题",\n      "description": "详细描述",\n      "priority": "high|medium|low",\n      "targetId": "相关 Schema/Flow ID（如有）"\n    }\n  ],\n  "contextSummary": "当前上下文摘要"\n}\n\n建议数量 1~5 条，按优先级排序。只输出 JSON。',
          prompt:
            '当前操作：{{$input.message}}\n\n对话历史：\n{{$conversation}}\n\n相关 Schema/Flow：\n{{$node.rag-1}}\n\n请生成智能建议。',
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 880, y: 200 },
        data: {
          label: '是否有建议',
          expression: 'lastOutput && lastOutput.suggestions && lastOutput.suggestions.length > 0',
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 1080, y: 120 },
        data: {
          label: '用户确认建议',
          confirmMessage: '根据您的操作上下文，我有以下建议，请选择采纳哪些：',
          confirmQuestions: [
            { id: 'q1', question: '采纳哪些建议？（输入建议编号，逗号分隔）', required: false },
            { id: 'q2', question: '有其他需求吗？', required: false },
          ],
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1080, y: 300 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'memory-1' },
      { id: 'e2', source: 'memory-1', target: 'rag-1' },
      { id: 'e3', source: 'rag-1', target: 'llm-1' },
      { id: 'e4', source: 'llm-1', target: 'if-1' },
      { id: 'e5', source: 'if-1', target: 'hitl-1', data: { branch: 'true' } },
      { id: 'e6', source: 'if-1', target: 'end-1', data: { branch: 'false' } },
      { id: 'e7', source: 'hitl-1', target: 'end-1' },
    ],
  })
}

/** 智能拟办：Webhook 接收文档 → 解析 → LLM 提取行动项 → HITL 确认 → HTTP 通知 */
export function createSmartActionProposalsWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/smart-actions',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '文档解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '提取行动项',
          model: 'default',
          systemPrompt:
            '你是项目管理助手。从文档中提取可执行的行动项、待办事项、审批需求。输出 JSON：\n{\n  "documentTitle": "文档标题",\n  "summary": "文档摘要",\n  "actionItems": [\n    {\n      "id": "a1",\n      "title": "行动项标题",\n      "description": "详细描述",\n      "assignee": "建议负责人（如有）",\n      "deadline": "建议截止日期（如有）",\n      "priority": "high|medium|low",\n      "type": "todo|approval|review|decision"\n    }\n  ],\n  "approvalChain": ["审批人1", "审批人2"]\n}\n\n只输出 JSON。',
          prompt:
            '文件名：{{$node.parse-1.filename}}\n\n文档内容：\n{{$node.parse-1.text}}\n\n请提取所有行动项和审批需求。',
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 800, y: 200 },
        data: {
          label: '人工审核拟办',
          confirmMessage: '已从文档中提取行动项，请确认或修改后执行：',
          confirmQuestions: [
            { id: 'q1', question: '是否确认以上行动项？', options: ['确认', '需要修改', '取消'], required: true },
            { id: 'q2', question: '补充说明（可选）', required: false },
          ],
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 1040, y: 200 },
        data: {
          label: '用户是否确认',
          expression: "hitlResult && hitlResult.q1 === '确认'",
        },
      },
      {
        id: 'notify-1',
        type: 'tool',
        position: { x: 1240, y: 120 },
        data: {
          label: '通知外部系统',
          toolCategory: 'workflow',
          toolName: 'http__request',
          toolArgs: {
            url: '{{$input.callbackUrl}}',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
              workflowId: '{{$execution.workflowId}}',
              status: 'approved',
              actionItems: '{{$node.llm-1.actionItems}}',
              timestamp: '{{$now}}',
            },
          },
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1240, y: 300 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'hitl-1' },
      { id: 'e4', source: 'hitl-1', target: 'if-1' },
      { id: 'e5', source: 'if-1', target: 'notify-1', data: { branch: 'true' } },
      { id: 'e6', source: 'if-1', target: 'end-1', data: { branch: 'false' } },
      { id: 'e7', source: 'notify-1', target: 'end-1' },
    ],
  })
}

/** 图文生成：手动触发 → LLM 文案 → LLM 图片 Prompt → LLM 图文合并 → 结束 */
export function createImageTextGenerationWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 200 },
        data: { label: '手动触发' },
      },
      {
        id: 'llm-outline',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '生成文案大纲',
          model: 'default',
          systemPrompt:
            '你是内容创作专家。根据用户需求生成图文内容的大纲和文案。输出 JSON：\n{\n  "title": "文章标题",\n  "style": "公众号|产品介绍|营销素材",\n  "sections": [\n    {\n      "heading": "段落标题",\n      "content": "文案内容",\n      "imagePrompt": "配图描述（用于生成图片的英文 prompt）",\n      "imagePosition": "top|bottom|left|right"\n    }\n  ],\n  "summary": "整体摘要"\n}\n\n只输出 JSON。',
          prompt: '用户需求：{{$input.message}}\n\n请生成图文内容大纲。',
        },
      },
      {
        id: 'llm-content',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '生成完整文案',
          model: 'default',
          systemPrompt:
            '你是专业文案编辑。根据大纲生成完整、流畅、有吸引力的文案内容。保持原文结构，优化措辞和可读性。直接输出最终文案（Markdown 格式），不要输出 JSON。',
          prompt:
            '大纲：\n{{$node.llm-outline}}\n\n请生成完整文案。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 800, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'llm-outline' },
      { id: 'e2', source: 'llm-outline', target: 'llm-content' },
      { id: 'e3', source: 'llm-content', target: 'end-1' },
    ],
  })
}

/** PPT 生成：手动触发 → LLM 大纲 → LLM 逐页内容 → LLM 汇总 → 结束 */
export function createPptGenerationWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 200 },
        data: { label: '手动触发' },
      },
      {
        id: 'memory-1',
        type: 'conversation-memory',
        position: { x: 280, y: 200 },
        data: {
          label: '读取上下文',
          memoryMode: 'read',
          maxHistoryTurns: 5,
        },
      },
      {
        id: 'llm-outline',
        type: 'llm',
        position: { x: 480, y: 200 },
        data: {
          label: '生成 PPT 大纲',
          model: 'default',
          systemPrompt:
            '你是演示文稿设计专家。根据用户需求生成 PPT 大纲。输出 JSON：\n{\n  "title": "演示文稿标题",\n  "template": "business|tech|education|creative",\n  "totalSlides": 10,\n  "slides": [\n    {\n      "index": 1,\n      "type": "title|content|chart|comparison|summary",\n      "heading": "页面标题",\n      "keyPoints": ["要点1", "要点2"],\n      "speakerNotes": "演讲者备注"\n    }\n  ]\n}\n\n页数控制在 8~15 页。只输出 JSON。',
          prompt: '用户需求：{{$input.message}}\n\n对话上下文：\n{{$conversation}}\n\n请生成 PPT 大纲。',
        },
      },
      {
        id: 'llm-detail',
        type: 'llm',
        position: { x: 720, y: 200 },
        data: {
          label: '生成每页详细内容',
          model: 'default',
          systemPrompt:
            '你是演示文稿内容专家。根据大纲为每一页生成详细的文案内容。输出 JSON：\n{\n  "title": "演示文稿标题",\n  "slides": [\n    {\n      "index": 1,\n      "type": "title",\n      "heading": "标题",\n      "subtitle": "副标题",\n      "content": ["要点1详细内容", "要点2详细内容"],\n      "speakerNotes": "演讲者备注",\n      "layout": "center|left|two-column|full-image"\n    }\n  ]\n}\n\n每页 content 不超过 5 个要点，每点不超过 50 字。只输出 JSON。',
          prompt: 'PPT 大纲：\n{{$node.llm-outline}}\n\n请生成每页详细内容。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 960, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'memory-1' },
      { id: 'e2', source: 'memory-1', target: 'llm-outline' },
      { id: 'e3', source: 'llm-outline', target: 'llm-detail' },
      { id: 'e4', source: 'llm-detail', target: 'end-1' },
    ],
  })
}

/**
 * 图片智能分析 — 两阶段架构
 *
 * Phase 1 — 小图快速提取（400px, quality 50）
 *   vision-analyze → 3行结构化 → LLM 解析 JSON（dateTime, category, location）
 *
 * Phase 2 — 大图深度生成（1024px, quality 85）
 *   emotion 路径：vision-analyze 大图 → LLM 融合地点上下文生成情感文案
 *   event/info 路径：LLM 基于 Phase 1 元数据生成摘要
 */
export function createImageAnalysisWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: '图片分析触发',
        },
      },
      // ── Phase 1：小图快速提取 ──
      {
        id: 'vision-phase1',
        type: 'vision-analyze',
        position: { x: 320, y: 200 },
        data: {
          label: 'Phase1 · 小图提取（400px）',
          documentSource: 'stream',
          streamField: 'image',
          visionImageWidth: 400,
          visionImageQuality: 50,
          visionPrompt: `Analyze this image and respond in EXACTLY three lines:
Line 1: 日期时间 → "YYYY-MM-DD HH:mm" 或 "NONE"
Line 2: 分类 → emotion / event / info
Line 3: 地点推断 → 短语如 "咖啡馆" 或 "UNKNOWN"

Only output the three lines, nothing else.`,
        },
      },
      {
        id: 'llm-parse',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '解析结构化数据',
          model: 'default',
          systemPrompt:
            '你是文本解析助手。将3行文本解析为 JSON。只输出 JSON，不要任何解释。',
          prompt: `解析以下3行文本为 JSON：

{{$node.vision-phase1.description}}

输出格式：
{
  "dateTime": "YYYY-MM-DD HH:mm" 或 null,
  "category": "emotion" | "event" | "info",
  "location": "地点描述" 或 null
}`,
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 800, y: 200 },
        data: {
          label: '分类判断',
          expression: "lastOutput && lastOutput.category === 'emotion'",
        },
      },
      // ── Phase 2 emotion：大图深度分析 ──
      {
        id: 'vision-phase2',
        type: 'vision-analyze',
        position: { x: 1040, y: 80 },
        data: {
          label: 'Phase2 · 大图情感分析（1024px）',
          documentSource: 'stream',
          streamField: 'image',
          visionImageWidth: 1024,
          visionImageQuality: 85,
          visionPrompt: `你正在看一张高清照片。
地点：{{$node.llm-parse.location}}，时间：{{$node.llm-parse.dateTime}}

用第一人称描述这张照片带给你的感受。
要求：一句话，30到50个字，融入地点和时间的氛围。
仿佛你就是按下快门的那个人，正在回忆这个瞬间。`,
        },
      },
      {
        id: 'llm-emotion',
        type: 'llm',
        position: { x: 1280, y: 80 },
        data: {
          label: '情感文案润色',
          model: 'default',
          systemPrompt: '你是情感文案助手。将粗糙的感受润色为优美的一句话。',
          prompt: `原始感受：{{$node.vision-phase2.description}}
地点：{{$node.llm-parse.location}}，时间：{{$node.llm-parse.dateTime}}

要求：
- 一句话，30到50个字
- 用自己的语言，禁止复制原文
- 融入地点氛围，仿佛你就是写下这些文字的人
直接输出润色后的一句话。`,
        },
      },
      // ── Phase 2 non-emotion：元数据摘要 ──
      {
        id: 'llm-event',
        type: 'llm',
        position: { x: 1040, y: 320 },
        data: {
          label: '事件/信息摘要',
          model: 'default',
          systemPrompt: '你是场景描述助手。',
          prompt: `分类：{{$node.llm-parse.category}}
地点：{{$node.llm-parse.location}}，时间：{{$node.llm-parse.dateTime}}

如果分类是 event：用第一人称叙述发生了什么，一句话，30到50字，融入地点氛围。
如果分类是 info：客观摘要关键信息，一句话，30到50字。

直接输出一句话。`,
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1520, y: 200 },
        data: {
          label: '结束',
          outputSource: 'lastOutput',
        },
      },
    ],
    edges: [
      // Phase 1
      { id: 'e1', source: 'trigger-1', target: 'vision-phase1' },
      { id: 'e2', source: 'vision-phase1', target: 'llm-parse' },
      { id: 'e3', source: 'llm-parse', target: 'if-1' },
      // Phase 2 emotion 路径
      { id: 'e4', source: 'if-1', target: 'vision-phase2', data: { branch: 'true' } },
      { id: 'e5', source: 'vision-phase2', target: 'llm-emotion' },
      { id: 'e6', source: 'llm-emotion', target: 'end-1' },
      // Phase 2 event/info 路径
      { id: 'e7', source: 'if-1', target: 'llm-event', data: { branch: 'false' } },
      { id: 'e8', source: 'llm-event', target: 'end-1' },
    ],
  })
}

/**
 * 智能助手 v2 — chat-parity-assistant
 *
 * 图：manual-trigger → intent-router
 *   →|needsAnalysis| requirement-analyzer → hitl → task-planner → task-chain → expert → collaboration-router
 *     →|continue| expert  (协作循环)
 *     →|nextStep| task-chain  (下一任务)
 *     →|summarize| summarizer → end
 *   →|matched| expert  (快捷路径)
 */
export function createChatParityAssistantWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 260 },
        data: { label: '手动触发' },
      },
      {
        id: 'intent-router-1',
        type: 'intent-router',
        position: { x: 320, y: 260 },
        data: {
          label: '意图路由',
          routingMode: 'auto',
          enableMultiIntentChain: false,
          fallbackExpertId: '',
        },
      },
      {
        id: 'req-analyzer-1',
        type: 'requirement-analyzer',
        position: { x: 600, y: 160 },
        data: {
          label: '需求分析',
          enableRag: true,
          enableTools: true,
          completenessThreshold: 80,
          model: 'default',
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 880, y: 160 },
        data: {
          label: '人工确认',
          confirmMessage: '请确认需求分析结果是否准确，是否需要补充信息',
          confirmQuestions: [
            { id: 'q1', question: '需求是否完整？', options: ['确认', '需要补充'], required: true },
          ],
        },
      },
      {
        id: 'task-planner-1',
        type: 'task-planner',
        position: { x: 1160, y: 160 },
        data: {
          label: '任务规划',
          inputSource: 'requirementAnalysis',
          maxSteps: 8,
          strategy: 'sequential',
          model: 'default',
        },
      },
      {
        id: 'task-chain-1',
        type: 'task-chain',
        position: { x: 1440, y: 160 },
        data: {
          label: '任务链',
          chainSource: 'upstream',
          staticChain: [],
          onStepOutput: '',
        },
      },
      {
        id: 'expert-1',
        type: 'expert',
        position: { x: 1440, y: 360 },
        data: {
          label: '专家执行',
          agentType: 'auto',
        },
      },
      {
        id: 'collab-router-1',
        type: 'collaboration-router',
        position: { x: 1720, y: 260 },
        data: {
          label: '协作路由',
          detectCollaborationTool: true,
          maxCollaborationRounds: 5,
        },
      },
      {
        id: 'summarizer-1',
        type: 'summarizer',
        position: { x: 2000, y: 360 },
        data: {
          label: '摘要输出',
          summarySource: 'taskChain',
          customPrompt: '',
          stream: false,
          model: 'default',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 2280, y: 360 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'intent-router-1' },
      // needsAnalysis 分支
      { id: 'e2', source: 'intent-router-1', target: 'req-analyzer-1', sourceHandle: 'needsAnalysis' },
      { id: 'e3', source: 'req-analyzer-1', target: 'hitl-1' },
      { id: 'e4', source: 'hitl-1', target: 'task-planner-1' },
      { id: 'e5', source: 'task-planner-1', target: 'task-chain-1' },
      { id: 'e6', source: 'task-chain-1', target: 'expert-1' },
      // matched 快捷路径
      { id: 'e7', source: 'intent-router-1', target: 'expert-1', sourceHandle: 'matched' },
      // expert → collaboration-router
      { id: 'e8', source: 'expert-1', target: 'collab-router-1' },
      // 协作路由三路分支
      { id: 'e9', source: 'collab-router-1', target: 'expert-1', sourceHandle: 'continue', data: { label: '继续协作' } },
      { id: 'e10', source: 'collab-router-1', target: 'task-chain-1', sourceHandle: 'nextStep', data: { label: '下一任务' } },
      { id: 'e11', source: 'collab-router-1', target: 'summarizer-1', sourceHandle: 'summarize', data: { label: '生成摘要' } },
      // 摘要 → 结束
      { id: 'e12', source: 'summarizer-1', target: 'end-1' },
    ],
  })
}

/**
 * 需求门控构建 — requirement-gated-build
 *
 * 图：manual-trigger → requirement-analyzer → hitl → task-planner
 *   → task-chain → expert(editor) → task-chain → expert(flow) → summarizer → end
 */
export function createRequirementGatedBuildWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 200 },
        data: { label: '手动触发' },
      },
      {
        id: 'req-analyzer-1',
        type: 'requirement-analyzer',
        position: { x: 360, y: 200 },
        data: {
          label: '需求分析',
          enableRag: true,
          enableTools: true,
          completenessThreshold: 80,
          model: 'default',
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 640, y: 200 },
        data: {
          label: '人工确认需求',
          confirmMessage: '请确认需求分析结果，确认后将按需求逐步构建',
          confirmQuestions: [
            { id: 'q1', question: '是否确认需求？', options: ['确认', '需要修改'], required: true },
          ],
        },
      },
      {
        id: 'task-planner-1',
        type: 'task-planner',
        position: { x: 920, y: 200 },
        data: {
          label: '任务规划',
          inputSource: 'requirementAnalysis',
          maxSteps: 8,
          strategy: 'sequential',
          model: 'default',
        },
      },
      {
        id: 'task-chain-editor',
        type: 'task-chain',
        position: { x: 1200, y: 200 },
        data: {
          label: '编辑器任务链',
          chainSource: 'upstream',
          staticChain: [],
          onStepOutput: '',
        },
      },
      {
        id: 'expert-editor',
        type: 'expert',
        position: { x: 1480, y: 200 },
        data: {
          label: '编辑器专家',
          agentType: 'editor',
          expertId: '',
        },
      },
      {
        id: 'task-chain-flow',
        type: 'task-chain',
        position: { x: 1760, y: 200 },
        data: {
          label: '流程任务链',
          chainSource: 'upstream',
          staticChain: [],
          onStepOutput: '',
        },
      },
      {
        id: 'expert-flow',
        type: 'expert',
        position: { x: 2040, y: 200 },
        data: {
          label: '流程专家',
          agentType: 'flow',
          expertId: '',
        },
      },
      {
        id: 'summarizer-1',
        type: 'summarizer',
        position: { x: 2320, y: 200 },
        data: {
          label: '摘要输出',
          summarySource: 'taskChain',
          customPrompt: '',
          stream: false,
          model: 'default',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 2600, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'req-analyzer-1' },
      { id: 'e2', source: 'req-analyzer-1', target: 'hitl-1' },
      { id: 'e3', source: 'hitl-1', target: 'task-planner-1' },
      { id: 'e4', source: 'task-planner-1', target: 'task-chain-editor' },
      { id: 'e5', source: 'task-chain-editor', target: 'expert-editor' },
      { id: 'e6', source: 'expert-editor', target: 'task-chain-flow' },
      { id: 'e7', source: 'task-chain-flow', target: 'expert-flow' },
      { id: 'e8', source: 'expert-flow', target: 'summarizer-1' },
      { id: 'e9', source: 'summarizer-1', target: 'end-1' },
    ],
  })
}

export function validateAgentWorkflowGraph(graph: AgentWorkflowGraph): AgentWorkflowValidationIssue[] {
  const issues: AgentWorkflowValidationIssue[] = []
  if (!graph.nodes.length) {
    issues.push({ level: 'error', message: '工作流至少需要一个节点' })
    return issues
  }
  if (!graph.entryNodeId || !graph.nodes.some((n) => n.id === graph.entryNodeId)) {
    issues.push({ level: 'error', message: '缺少有效的入口节点' })
  }

  // C1: 重复节点 ID 检查
  const seenIds = new Set<string>()
  for (const node of graph.nodes) {
    if (seenIds.has(node.id)) {
      issues.push({ level: 'error', nodeId: node.id, message: `节点 ID "${node.id}" 重复` })
    }
    seenIds.add(node.id)
  }

  const nodeIds = new Set(graph.nodes.map((n) => n.id))
  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      issues.push({ level: 'error', message: `连线 ${edge.id} 引用了不存在的节点` })
    }
  }
  const triggers = graph.nodes.filter((n) => n.type === 'manual-trigger' || n.type === 'webhook-trigger')
  if (triggers.length === 0) {
    issues.push({ level: 'error', message: '需要至少一个触发节点（手动或 Webhook）' })
  }
  if (triggers.length > 1) {
    issues.push({ level: 'warning', message: '存在多个手动触发节点，仅 entryNodeId 指定的节点作为入口' })
  }
  const ends = graph.nodes.filter((n) => n.type === 'end')
  if (ends.length === 0) {
    issues.push({ level: 'warning', message: '建议添加「结束」节点' })
  }
  for (const node of graph.nodes) {
    if (!node.data?.label?.trim()) {
      issues.push({ level: 'warning', nodeId: node.id, message: '节点缺少显示名称' })
    }
    if (node.type === 'llm' && !node.data.prompt?.trim()) {
      issues.push({ level: 'warning', nodeId: node.id, message: 'LLM 节点未配置 Prompt' })
    }
    if (node.type === 'tool' && !node.data.toolName?.trim()) {
      issues.push({ level: 'warning', nodeId: node.id, message: '工具节点未选择具体工具' })
    }
    if (node.type === 'expert' && !node.data.expertId?.trim()) {
      issues.push({ level: 'warning', nodeId: node.id, message: '专家节点未选择插件专家' })
    }
    // I3: webhook-trigger 必须有 webhookPath
    if (node.type === 'webhook-trigger' && !node.data.webhookPath?.trim()) {
      issues.push({ level: 'error', nodeId: node.id, message: 'Webhook 触发节点未配置路径' })
    }
    // C2: if 节点必须有 true 和 false 两条分支
    if (node.type === 'if') {
      const outEdges = graph.edges.filter((e) => e.source === node.id)
      const branches = outEdges.map((e) => e.data?.branch).filter(Boolean)
      if (!branches.includes('true') || !branches.includes('false')) {
        issues.push({ level: 'error', nodeId: node.id, message: '条件节点缺少 true 或 false 分支连线' })
      }
    }
    // ── 新节点校验 ──
    if (node.type === 'intent-router') {
      const d = node.data as IntentRouterNodeData
      if (d.routingMode === 'explicit' && !d.fallbackExpertId?.trim()) {
        issues.push({ level: 'warning', nodeId: node.id, message: '意图路由（explicit 模式）建议配置 fallback 专家' })
      }
    }
    if (node.type === 'summarizer') {
      const d = node.data as SummarizerNodeData
      if (d.summarySource === 'custom' && !d.customPrompt?.trim()) {
        issues.push({ level: 'error', nodeId: node.id, message: '摘要节点（custom 来源）未配置自定义 Prompt' })
      }
    }
    if (node.type === 'requirement-analyzer') {
      const d = node.data as RequirementAnalyzerNodeData
      if (d.completenessThreshold < 0 || d.completenessThreshold > 100) {
        issues.push({ level: 'error', nodeId: node.id, message: '需求分析节点完整度阈值必须在 0-100 之间' })
      }
    }
    if (node.type === 'task-planner') {
      const d = node.data as TaskPlannerNodeData
      if (d.maxSteps < 1) {
        issues.push({ level: 'error', nodeId: node.id, message: '任务规划节点最大步骤数不能小于 1' })
      }
    }
    if (node.type === 'task-chain') {
      const d = node.data as TaskChainNodeData
      if (d.chainSource === 'static' && (!d.staticChain || d.staticChain.length === 0)) {
        issues.push({ level: 'error', nodeId: node.id, message: '任务链节点（static 来源）未配置静态步骤' })
      }
    }
    if (node.type === 'collaboration-router') {
      const d = node.data as CollaborationRouterNodeData
      if (d.maxCollaborationRounds < 1) {
        issues.push({ level: 'error', nodeId: node.id, message: '协作路由节点最大轮次不能小于 1' })
      }
    }
  }
  return issues
}
