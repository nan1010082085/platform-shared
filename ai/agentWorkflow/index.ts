/**
 * Agent 工作流编排 - barrel re-export
 *
 * 拆分自原 agentWorkflow.ts，保持对外 import 路径不变。
 */

// ── 类型 ──
export type {
  ExpertNodeType,
  AgentNodeType,
  AgentWorkflowStatus,
  AgentExecutionStatus,
  AgentNodeRecordStatus,
  AgentHitlConfirmQuestion,
  AgentConversationTurn,
  AgentWorkflowNodeData,
  ImageGenerateNodeData,
  VideoGenerateNodeData,
  TaskPlanStep,
  IntentRouterNodeData,
  SummarizerNodeData,
  RequirementAnalyzerNodeData,
  TaskPlannerNodeData,
  TaskChainNodeData,
  CollaborationRouterNodeData,
  AgentWorkflowNode,
  AgentWorkflowEdge,
  AgentWorkflowGraph,
  AgentWorkflowSummary,
  AgentWorkflowDetail,
  AgentWorkflowPublishResult,
  AgentWorkflowVersionEntry,
  AgentWorkflowVersionDetail,
  AgentNodeRecord,
  AgentWorkflowStreamingOutput,
  AgentWorkflowExecution,
  AgentWorkflowValidationIssue,
} from './types.js'

export type {
  AgentWorkflowTemplateId,
  AgentWorkflowTemplateMeta,
} from './templates.js'

// ── 默认数据与布局 ──
export {
  createDefaultAgentWorkflowGraph,
  createDefaultNodeData,
  layoutAgentWorkflowGraph,
} from './defaults.js'

// ── 模板元数据 ──
export { AGENT_WORKFLOW_TEMPLATES } from './templates.js'

// ── 校验 ──
export { validateAgentWorkflowGraph } from './validation.js'

// ── 模板分发器 ──
export { createAgentWorkflowGraphByTemplate } from './createByTemplate.js'

// ── 模板工厂函数 ──
export { createDocumentSummaryWorkflowGraph } from './templateFactories/documentSummary.js'
export { createDocImageRecognitionWorkflowGraph } from './templateFactories/docImageRecognition.js'
export { createIntelligentAssistantWorkflowGraph } from './templateFactories/intelligentAssistant.js'
export { createContractExtractWorkflowGraph } from './templateFactories/contractExtract.js'
export { createKbFaqWorkflowGraph } from './templateFactories/kbFaq.js'
export { createHttpNotifyWorkflowGraph } from './templateFactories/httpNotify.js'
export { createRagIngestQaWorkflowGraph } from './templateFactories/ragIngestQa.js'
export { createMultiDocBatchWorkflowGraph } from './templateFactories/multiDocBatch.js'
export { createSmartSuggestionsWorkflowGraph } from './templateFactories/smartSuggestions.js'
export { createSmartActionProposalsWorkflowGraph } from './templateFactories/smartActionProposals.js'
export { createImageTextGenerationWorkflowGraph } from './templateFactories/imageTextGeneration.js'
export { createPptGenerationWorkflowGraph } from './templateFactories/pptGeneration.js'
export { createImageAnalysisWorkflowGraph } from './templateFactories/imageAnalysis.js'
export { createChatParityAssistantWorkflowGraph } from './templateFactories/chatParityAssistant.js'
export { createRequirementGatedBuildWorkflowGraph } from './templateFactories/requirementGatedBuild.js'
export { createCsTicketTriageWorkflowGraph } from './templateFactories/csTicketTriage.js'
export { createCsKbReplyWorkflowGraph } from './templateFactories/csKbReply.js'
export { createCsSentimentEscalateWorkflowGraph } from './templateFactories/csSentimentEscalate.js'
export { createExcelReportWorkflowGraph } from './templateFactories/excelReport.js'
export { createMultiDocCompareWorkflowGraph } from './templateFactories/multiDocCompare.js'
export { createStructuredExtractWorkflowGraph } from './templateFactories/structuredExtract.js'
export { createWebhookBatchDispatchWorkflowGraph } from './templateFactories/webhookBatchDispatch.js'
export { createHandoffDemoWorkflowGraph } from './templateFactories/handoffDemo.js'
export { createFormQueryDemoWorkflowGraph } from './templateFactories/formQueryDemo.js'
export { createContentComplianceWorkflowGraph } from './templateFactories/contentCompliance.js'
export { createContractRiskTagWorkflowGraph } from './templateFactories/contractRiskTag.js'
export { createFaqQualityCheckWorkflowGraph } from './templateFactories/faqQualityCheck.js'
export { createMultimodalImageTextWorkflowGraph } from './templateFactories/multimodalImageText.js'
export { createMultimodalVideoPromoWorkflowGraph } from './templateFactories/multimodalVideoPromo.js'
export { createResumeScreeningWorkflowGraph } from './templateFactories/resumeScreening.js'
export { createExpenseAuditWorkflowGraph } from './templateFactories/expenseAudit.js'
export { createFeedbackAnalysisWorkflowGraph } from './templateFactories/feedbackAnalysis.js'
