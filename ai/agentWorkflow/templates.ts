/**
 * Agent 工作流 - 模板元数据
 */
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
  | 'cs-ticket-triage'
  | 'cs-kb-reply'
  | 'cs-sentiment-escalate'
  | 'excel-report'
  | 'multi-doc-compare'
  | 'structured-extract'
  | 'webhook-batch-dispatch'
  | 'content-compliance'
  | 'contract-risk-tag'
  | 'faq-quality-check'
  | 'multimodal-image-text'
  | 'multimodal-video-promo'
  | 'resume-screening'
  | 'expense-audit'
  | 'feedback-analysis'
  | 'memory-assistant'
  | 'medical-record-extract'
  | 'education-homework-grading'
  | 'manufacturing-quality-report'
  | 'legal-case-summary'
  | 'government-petition-classify'
  | 'retail-inventory-forecast'
  | 'finance-loan-review'
  | 'energy-consumption-report'

export interface AgentWorkflowTemplateMeta {
  id: AgentWorkflowTemplateId
  name: string
  description: string
  category: 'general' | 'document' | 'assistant' | 'integration' | 'batch' | 'customer-service' | 'audit' | 'hr' | 'finance' | 'operations' | 'medical' | 'education' | 'manufacturing' | 'legal' | 'government' | 'retail' | 'energy'
  icon?: string
  tags?: string[]
}

export const AGENT_WORKFLOW_TEMPLATES: AgentWorkflowTemplateMeta[] = [
  {
    id: 'blank',
    name: '空白工作流',
    description: '手动触发 + LLM + 结束，从零开始搭建',
    category: 'general',
    icon: 'plus',
    tags: ['general', 'blank'],
  },
  {
    id: 'document-summary',
    name: '文档摘要',
    description: 'Webhook 接收 documentId，解析后生成摘要',
    category: 'document',
    icon: 'document',
    tags: ['document', 'summary'],
  },
  {
    id: 'doc-image-recognition',
    name: '文档 / 图片识别',
    description: '解析上传文件，图片走 OCR 分支，文档走结构化提取',
    category: 'document',
    icon: 'picture',
    tags: ['document', 'image', 'ocr'],
  },
  {
    id: 'intelligent-assistant',
    name: '智能助手问答',
    description: 'RAG 检索知识库后由 LLM 生成帮助回答',
    category: 'assistant',
    icon: 'chat-dot-round',
    tags: ['assistant', 'rag'],
  },
  {
    id: 'contract-extract',
    name: '合同条款提取',
    description: '上传合同文档，解析后由 LLM 结构化提取关键条款与风险点',
    category: 'document',
    icon: 'document',
    tags: ['document', 'extract', 'contract'],
  },
  {
    id: 'kb-faq',
    name: '知识库 FAQ 生成',
    description: 'Webhook 接收文档，由 LLM 自动生成问答对并写入知识库',
    category: 'assistant',
    icon: 'notebook',
    tags: ['assistant', 'rag', 'faq'],
  },
  {
    id: 'http-notify',
    name: 'HTTP 回调通知',
    description: 'Webhook 接收数据 → LLM 处理 → HTTP POST 结果到外部系统',
    category: 'integration',
    icon: 'promotion',
    tags: ['integration', 'http', 'webhook'],
  },
  {
    id: 'rag-ingest-qa',
    name: 'RAG 入库质检',
    description: '文档解析后经 LLM 质检，合格文档自动入库，不合格触发人工审核',
    category: 'assistant',
    icon: 'filter',
    tags: ['assistant', 'rag', 'quality'],
  },
  {
    id: 'multi-doc-batch',
    name: '多文档批量处理',
    description: 'Webhook 接收文档，解析后由 LLM 生成摘要并汇总结果（多次调用可累积）',
    category: 'batch',
    icon: 'files',
    tags: ['batch', 'document', 'summary'],
  },
  {
    id: 'smart-suggestions',
    name: '智能建议',
    description: '根据用户操作上下文，AI 主动推荐下一步操作、优化方案、相关 Schema/Flow',
    category: 'assistant',
    icon: 'magic-stick',
    tags: ['assistant', 'suggestions'],
  },
  {
    id: 'smart-action-proposals',
    name: '智能拟办',
    description: '从文档/对话中提取行动项，自动生成待办事项、审批流程、任务分配方案',
    category: 'document',
    icon: 'list',
    tags: ['document', 'action', 'todo'],
  },
  {
    id: 'image-text-generation',
    name: '图文生成',
    description: '根据用户描述生成配图+文案的组合内容（公众号文章、产品介绍、营销素材）',
    category: 'general',
    icon: 'picture',
    tags: ['general', 'image', 'content'],
  },
  {
    id: 'ppt-generation',
    name: 'PPT 生成',
    description: '根据用户描述或文档内容，AI 自动生成演示文稿（结构+内容+配图）',
    category: 'general',
    icon: 'data-board',
    tags: ['general', 'ppt'],
  },
  {
    id: 'image-analysis',
    name: '图片智能分析',
    description: '图片分析 → 结构化提取（日期/分类/地点）→ 根据类型生成情感/事件/信息微叙事',
    category: 'document',
    icon: 'picture',
    tags: ['document', 'image', 'analysis'],
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
    icon: 'circle-check',
    tags: ['requirement', 'gated', 'multi-step'],
  },
  {
    id: 'cs-ticket-triage',
    name: '客服工单智能分流',
    description: 'Webhook/手动接收工单文本，LLM 分类为咨询/投诉/退款/技术，按优先级分流并输出 category、priority、suggestedTeam',
    category: 'customer-service',
    icon: 'message',
    tags: ['customer-service', 'industry', 'triage'],
  },
  {
    id: 'cs-kb-reply',
    name: '客服知识库回复',
    description: '手动触发后检索知识库，由 LLM 生成客服回复草稿',
    category: 'customer-service',
    icon: 'chat-dot-round',
    tags: ['customer-service', 'industry', 'rag'],
  },
  {
    id: 'cs-sentiment-escalate',
    name: '情绪检测与升级',
    description: 'Webhook 接收客户消息，LLM 情绪分析；负面情绪进入人工审核，否则直接结束',
    category: 'customer-service',
    icon: 'warning',
    tags: ['customer-service', 'industry', 'hitl'],
  },
  {
    id: 'excel-report',
    name: 'Excel 报表洞察',
    description: 'Webhook 接收 Excel/CSV 文件，解析后由 LLM 生成数据摘要、趋势洞察与异常提示',
    category: 'batch',
    icon: 'document',
    tags: ['data', 'excel', 'report'],
  },
  {
    id: 'multi-doc-compare',
    name: '多文档对比',
    description: '手动触发，结合会话记忆对多份文档进行差异对比、一致性检查与合并建议',
    category: 'document',
    icon: 'document',
    tags: ['document', 'compare'],
  },
  {
    id: 'structured-extract',
    name: '结构化字段提取',
    description: 'Webhook 接收文档，解析后由 LLM 按指定 schema 提取字段并输出 JSON，便于下游系统消费',
    category: 'document',
    icon: 'document',
    tags: ['document', 'extract', 'json'],
  },
  {
    id: 'webhook-batch-dispatch',
    name: '批量任务分发',
    description: 'Webhook 接收批量任务，任务规划拆解 -> 任务链逐步执行 -> 摘要汇总结果',
    category: 'integration',
    icon: 'connection',
    tags: ['integration', 'batch', 'task-chain'],
  },
  {
    id: 'content-compliance',
    name: '内容合规审查',
    description: 'Webhook 接收内容，LLM 合规审查；命中违规进入人工审核，否则直接放行',
    category: 'audit',
    icon: 'warning',
    tags: ['audit', 'compliance', 'hitl'],
  },
  {
    id: 'contract-risk-tag',
    name: '合同风险标注',
    description: '手动触发上传合同，解析后由 LLM 标注风险等级与条款，再经人工确认输出终稿',
    category: 'audit',
    icon: 'warning',
    tags: ['audit', 'contract', 'risk', 'hitl'],
  },
  {
    id: 'faq-quality-check',
    name: 'FAQ 质检',
    description: 'Webhook 接收 FAQ 条目，LLM 检查准确性与完整性；不合格进入人工复核',
    category: 'audit',
    icon: 'warning',
    tags: ['audit', 'faq', 'quality', 'hitl'],
  },
  {
    id: 'multimodal-image-text',
    name: '图文批量生成',
    description: 'LLM 生成文案与配图 prompt -> 图片生成节点产出多张配图，组合为图文素材',
    category: 'general',
    icon: 'picture',
    tags: ['multimodal', 'image', 'batch'],
  },
  {
    id: 'multimodal-video-promo',
    name: '视频营销生成',
    description: 'LLM 生成视频脚本 -> 视频生成节点产出短视频，适合营销/宣传素材快速生产',
    category: 'general',
    icon: 'video-play',
    tags: ['multimodal', 'video', 'marketing'],
  },
  {
    id: 'resume-screening',
    name: '简历筛选',
    description: '解析简历文档，提取关键信息，匹配岗位要求，输出评分与录用建议',
    category: 'hr',
    icon: 'user',
    tags: ['resume', 'screening', 'hr', 'document'],
  },
  {
    id: 'expense-audit',
    name: '报销单审核',
    description: '解析报销凭证，核对金额与项目合规性，输出审核结果与异常项',
    category: 'finance',
    icon: 'coin',
    tags: ['expense', 'audit', 'finance', 'compliance'],
  },
  {
    id: 'feedback-analysis',
    name: '客户反馈分析',
    description: '批量处理客户反馈，情感分类+主题提取，生成汇总报告',
    category: 'operations',
    icon: 'data-analysis',
    tags: ['feedback', 'sentiment', 'analysis', 'batch'],
  },
  {
    id: 'memory-assistant',
    name: '记忆增强助手',
    description: '召回用户长程记忆 -> 结合记忆回答 -> 自动提取并沉淀新记忆，跨会话个性化',
    category: 'assistant',
    icon: 'data-board',
    tags: ['assistant', 'memory', 'long-term'],
  },
  {
    id: 'medical-record-extract',
    name: '病历结构化提取',
    description: '解析病历文档，结构化提取主诉/诊断/用药/检查，输出标准病历摘要',
    category: 'medical',
    icon: 'document',
    tags: ['medical', 'extract', 'structured', 'document'],
  },
  {
    id: 'education-homework-grading',
    name: '作业批改',
    description: '解析学生作业，LLM 按评分标准批改，输出分数、错题与评语',
    category: 'education',
    icon: 'edit',
    tags: ['education', 'grading', 'homework', 'document'],
  },
  {
    id: 'manufacturing-quality-report',
    name: '质检报告生成',
    description: '解析质检数据，异常检测 + 不合格项分析，生成质检报告与改进建议',
    category: 'manufacturing',
    icon: 'data-analysis',
    tags: ['manufacturing', 'quality', 'report', 'audit'],
  },
  {
    id: 'legal-case-summary',
    name: '案件摘要提取',
    description: '解析案件文档，提取当事人/诉求/事实/法律点，生成结构化案件摘要',
    category: 'legal',
    icon: 'document',
    tags: ['legal', 'case', 'summary', 'extract'],
  },
  {
    id: 'government-petition-classify',
    name: '政务诉求分类',
    description: '对群众诉求文本分类、判定紧急度，给出派发部门与处理建议',
    category: 'government',
    icon: 'chat-dot-round',
    tags: ['government', 'petition', 'classify', 'dispatch'],
  },
  {
    id: 'retail-inventory-forecast',
    name: '库存补货预测',
    description: '分析库存数据，预测缺货风险，输出补货清单与采购建议',
    category: 'retail',
    icon: 'goods',
    tags: ['retail', 'inventory', 'forecast', 'restock'],
  },
  {
    id: 'finance-loan-review',
    name: '贷款风险评估',
    description: '解析贷款申请，评估信用与还款能力，输出风险评分与审批建议',
    category: 'finance',
    icon: 'coin',
    tags: ['finance', 'loan', 'risk', 'audit'],
  },
  {
    id: 'energy-consumption-report',
    name: '能耗分析报告',
    description: '解析能耗数据，识别异常用电与节能空间，生成节能建议报告',
    category: 'energy',
    icon: 'data-analysis',
    tags: ['energy', 'consumption', 'analysis', 'report'],
  },
]
