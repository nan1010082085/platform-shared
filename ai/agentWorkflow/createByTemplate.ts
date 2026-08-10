/**
 * Agent 工作流 - 模板分发器
 */

import type { AgentWorkflowGraph } from './types.js'
import type { AgentWorkflowTemplateId } from './templates.js'
import { createDefaultAgentWorkflowGraph } from './defaults.js'
import { createDocumentSummaryWorkflowGraph } from './templateFactories/documentSummary.js'
import { createDocImageRecognitionWorkflowGraph } from './templateFactories/docImageRecognition.js'
import { createIntelligentAssistantWorkflowGraph } from './templateFactories/intelligentAssistant.js'
import { createContractExtractWorkflowGraph } from './templateFactories/contractExtract.js'
import { createKbFaqWorkflowGraph } from './templateFactories/kbFaq.js'
import { createHttpNotifyWorkflowGraph } from './templateFactories/httpNotify.js'
import { createRagIngestQaWorkflowGraph } from './templateFactories/ragIngestQa.js'
import { createMultiDocBatchWorkflowGraph } from './templateFactories/multiDocBatch.js'
import { createSmartSuggestionsWorkflowGraph } from './templateFactories/smartSuggestions.js'
import { createSmartActionProposalsWorkflowGraph } from './templateFactories/smartActionProposals.js'
import { createImageTextGenerationWorkflowGraph } from './templateFactories/imageTextGeneration.js'
import { createPptGenerationWorkflowGraph } from './templateFactories/pptGeneration.js'
import { createImageAnalysisWorkflowGraph } from './templateFactories/imageAnalysis.js'
import { createChatParityAssistantWorkflowGraph } from './templateFactories/chatParityAssistant.js'
import { createRequirementGatedBuildWorkflowGraph } from './templateFactories/requirementGatedBuild.js'
import { createCsTicketTriageWorkflowGraph } from './templateFactories/csTicketTriage.js'
import { createCsKbReplyWorkflowGraph } from './templateFactories/csKbReply.js'
import { createCsSentimentEscalateWorkflowGraph } from './templateFactories/csSentimentEscalate.js'
import { createExcelReportWorkflowGraph } from './templateFactories/excelReport.js'
import { createMultiDocCompareWorkflowGraph } from './templateFactories/multiDocCompare.js'
import { createStructuredExtractWorkflowGraph } from './templateFactories/structuredExtract.js'
import { createWebhookBatchDispatchWorkflowGraph } from './templateFactories/webhookBatchDispatch.js'
import { createContentComplianceWorkflowGraph } from './templateFactories/contentCompliance.js'
import { createContractRiskTagWorkflowGraph } from './templateFactories/contractRiskTag.js'
import { createFaqQualityCheckWorkflowGraph } from './templateFactories/faqQualityCheck.js'
import { createMultimodalImageTextWorkflowGraph } from './templateFactories/multimodalImageText.js'
import { createMultimodalVideoPromoWorkflowGraph } from './templateFactories/multimodalVideoPromo.js'
import { createResumeScreeningWorkflowGraph } from './templateFactories/resumeScreening.js'
import { createExpenseAuditWorkflowGraph } from './templateFactories/expenseAudit.js'
import { createFeedbackAnalysisWorkflowGraph } from './templateFactories/feedbackAnalysis.js'
import { createMemoryAssistantWorkflowGraph } from './templateFactories/memoryAssistant.js'
import { createMedicalRecordExtractWorkflowGraph } from './templateFactories/medicalRecordExtract.js'
import { createEducationHomeworkGradingWorkflowGraph } from './templateFactories/educationHomeworkGrading.js'
import { createManufacturingQualityReportWorkflowGraph } from './templateFactories/manufacturingQualityReport.js'
import { createLegalCaseSummaryWorkflowGraph } from './templateFactories/legalCaseSummary.js'
import { createGovernmentPetitionClassifyWorkflowGraph } from './templateFactories/governmentPetitionClassify.js'
import { createRetailInventoryForecastWorkflowGraph } from './templateFactories/retailInventoryForecast.js'
import { createFinanceLoanReviewWorkflowGraph } from './templateFactories/financeLoanReview.js'
import { createEnergyConsumptionReportWorkflowGraph } from './templateFactories/energyConsumptionReport.js'
import { createVoteDecisionWorkflowGraph } from './templateFactories/voteDecision.js'
import { createMultimodalLlmAnalyzeWorkflowGraph } from './templateFactories/multimodalLlmAnalyze.js'
import { createSmartFormSearchWorkflowGraph } from './templateFactories/smartFormSearch.js'
import { createScheduledReportWorkflowGraph } from './templateFactories/scheduledReport.js'
import { createCodeExecuteDemoWorkflowGraph } from './templateFactories/codeExecuteDemo.js'
import { createSwitchDemoWorkflowGraph } from './templateFactories/switchDemo.js'
import { createParallelTeamDemoWorkflowGraph } from './templateFactories/parallelTeamDemo.js'
import { createDashboardAssistWorkflowGraph } from './templateFactories/dashboardAssist.js'
import { createHandoffDemoWorkflowGraph } from './templateFactories/handoffDemo.js'
import { createFormQueryDemoWorkflowGraph } from './templateFactories/formQueryDemo.js'

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
    case 'cs-ticket-triage':
      return createCsTicketTriageWorkflowGraph()
    case 'cs-kb-reply':
      return createCsKbReplyWorkflowGraph()
    case 'cs-sentiment-escalate':
      return createCsSentimentEscalateWorkflowGraph()
    case 'excel-report':
      return createExcelReportWorkflowGraph()
    case 'multi-doc-compare':
      return createMultiDocCompareWorkflowGraph()
    case 'structured-extract':
      return createStructuredExtractWorkflowGraph()
    case 'webhook-batch-dispatch':
      return createWebhookBatchDispatchWorkflowGraph()
    case 'content-compliance':
      return createContentComplianceWorkflowGraph()
    case 'contract-risk-tag':
      return createContractRiskTagWorkflowGraph()
    case 'faq-quality-check':
      return createFaqQualityCheckWorkflowGraph()
    case 'multimodal-image-text':
      return createMultimodalImageTextWorkflowGraph()
    case 'multimodal-video-promo':
      return createMultimodalVideoPromoWorkflowGraph()
    case 'resume-screening':
      return createResumeScreeningWorkflowGraph()
    case 'expense-audit':
      return createExpenseAuditWorkflowGraph()
    case 'feedback-analysis':
      return createFeedbackAnalysisWorkflowGraph()
    case 'memory-assistant':
      return createMemoryAssistantWorkflowGraph()
    case 'medical-record-extract':
      return createMedicalRecordExtractWorkflowGraph()
    case 'education-homework-grading':
      return createEducationHomeworkGradingWorkflowGraph()
    case 'manufacturing-quality-report':
      return createManufacturingQualityReportWorkflowGraph()
    case 'legal-case-summary':
      return createLegalCaseSummaryWorkflowGraph()
    case 'government-petition-classify':
      return createGovernmentPetitionClassifyWorkflowGraph()
    case 'retail-inventory-forecast':
      return createRetailInventoryForecastWorkflowGraph()
    case 'finance-loan-review':
      return createFinanceLoanReviewWorkflowGraph()
    case 'energy-consumption-report':
      return createEnergyConsumptionReportWorkflowGraph()
    case 'vote-decision':
      return createVoteDecisionWorkflowGraph()
    case 'multimodal-llm-analyze':
      return createMultimodalLlmAnalyzeWorkflowGraph()
    case 'smart-form-search':
      return createSmartFormSearchWorkflowGraph()
    case 'scheduled-report':
      return createScheduledReportWorkflowGraph()
    case 'code-execute-demo':
      return createCodeExecuteDemoWorkflowGraph()
    case 'switch-demo':
      return createSwitchDemoWorkflowGraph()
    case 'parallel-team-demo':
      return createParallelTeamDemoWorkflowGraph()
    case 'dashboard-assist':
      return createDashboardAssistWorkflowGraph()
    case 'handoff-demo':
      return createHandoffDemoWorkflowGraph()
    case 'form-query-demo':
      return createFormQueryDemoWorkflowGraph()
    case 'blank':
    default:
      return createDefaultAgentWorkflowGraph()
  }
}
