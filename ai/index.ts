/**
 * @ai-shared
 *
 * AI 智能体所需的元数据和 prompt 构建能力。
 * 从 editor widget configs 和 flow node definitions 构建时提取，
 * 保证 AI 知识与编辑器/流程引擎单一数据源。
 */

// 类型
export type {
  WidgetAIMetadata,
  FlowNodeAIMetadata,
  AIMetadata,
} from './types.js'

// 模型提供商与模型配置
export type {
  ProviderType,
  Provider,
  ProviderWithMaskedKey,
  ModelParameters,
  Model,
  ProviderWithModels,
} from './providerModel.js'

// 统一事件协议
export type {
  AgentEventType,
  AgentType,
  AgentEvent,
  AgentStreamEvent,
  SSEEvent,
  TextDeltaEvent,
  ThinkingDeltaEvent,
  SchemaStartEvent,
  SchemaProgressEvent,
  SchemaCompleteEvent,
  SchemaDiffEvent,
  FlowStartEvent,
  FlowProgressEvent,
  FlowCompleteEvent,
  FlowDiffEvent,
  ToolInfo,
  ToolCallStartEvent,
  ToolCallEndEvent,
  ToolErrorEvent,
  AgentSwitchEvent,
  AgentCollaborationEvent,
  TaskChainStep,
  ChainStartEvent,
  ChainStepEvent,
  ChainCompleteEvent,
  InterruptEvent,
  ResumeEvent,
  DoneEvent,
  ErrorEvent,
  SchemaBuildStep,
} from './events.js'

// Prompt 构建器
export {
  buildEditorSystemPrompt,
  buildFlowSystemPrompt,
  ROUTER_SYSTEM_PROMPT,
} from './promptBuilder.js'

// Runtime Agent
export { RuntimeAgent } from './runtimeAgent.js'
export type {
  RuntimeAIRequest,
  ExecutionContext,
  AssigneeRecommendation,
  OutcomePrediction,
  AnomalyDetection,
} from './runtimeAgent.js'

export {
  EVENT_ACTION_TYPES,
  EVENT_ACTION_DESCRIPTIONS,
  EVENT_ACTION_FIELDS,
  EVENT_TRIGGERS,
  LINKAGE_TYPES,
  LINKAGE_DESCRIPTIONS,
  VARIABLE_TYPES,
  VARIABLE_SCOPE_DESCRIPTIONS,
  API_CONFIG_FIELDS,
  OUTPUT_TAGS,
} from './systemKnowledge.js'

export type {
  ExpertNodeType,
  AgentHitlConfirmQuestion,
  AgentNodeType,
  AgentWorkflowTemplateId,
  AgentWorkflowTemplateMeta,
  AgentConversationTurn,
  AgentWorkflowStatus,
  AgentExecutionStatus,
  AgentNodeRecordStatus,
  AgentWorkflowNodeData,
  AgentWorkflowNode,
  AgentWorkflowEdge,
  AgentWorkflowGraph,
  AgentWorkflowSummary,
  AgentWorkflowDetail,
  AgentWorkflowPublishResult,
  AgentWorkflowVersionEntry,
  AgentWorkflowVersionDetail,
  AgentNodeRecord,
  AgentWorkflowExecution,
  AgentWorkflowValidationIssue,
  ImageGenerateNodeData,
  TaskPlanStep,
  IntentRouterNodeData,
  SummarizerNodeData,
  RequirementAnalyzerNodeData,
  TaskPlannerNodeData,
  TaskChainNodeData,
  CollaborationRouterNodeData,
} from './agentWorkflow.js'

export {
  createDefaultAgentWorkflowGraph,
  createDefaultNodeData,
  createDocumentSummaryWorkflowGraph,
  createDocImageRecognitionWorkflowGraph,
  createIntelligentAssistantWorkflowGraph,
  createContractExtractWorkflowGraph,
  createKbFaqWorkflowGraph,
  createHttpNotifyWorkflowGraph,
  createRagIngestQaWorkflowGraph,
  createMultiDocBatchWorkflowGraph,
  createChatParityAssistantWorkflowGraph,
  createAgentWorkflowGraphByTemplate,
  layoutAgentWorkflowGraph,
  validateAgentWorkflowGraph,
  AGENT_WORKFLOW_TEMPLATES,
} from './agentWorkflow.js'

export type {
  DocumentChunk,
  StructuredSummary,
  DocumentRecord,
  DocumentPreview,
  MessageDocumentAttachment,
  MessageDocumentSummary,
} from './document.js'

export {
  DOCUMENT_UPLOAD_ACCEPT,
  DOCUMENT_FORMAT_LABEL,
  isAllowedDocumentUpload,
} from './document.js'

export {
  normalizeToolName,
  getToolDisplayLabel,
  TOOL_DISPLAY_LABELS,
  EDITOR_MCP_TOOLS_PROMPT,
  FLOW_MCP_TOOLS_PROMPT,
  PAGE_MCP_TOOLS_PROMPT,
  REQUIREMENT_ANALYZER_TOOLS_PROMPT,
  SCHEMA_SEARCH,
  SCHEMA_GET_DETAIL,
  SCHEMA_VALIDATE_WIDGETS,
  FLOW_SEARCH,
  FLOW_VALIDATE,
  RAG_SEARCH,
  UPDATE_SCHEMA,
  UPDATE_FLOW,
  GENERATE_SCHEMA,
} from './toolNames.js'
