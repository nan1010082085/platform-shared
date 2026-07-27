/**
 * Agent 工作流 - 图校验
 */

import type {
  AgentWorkflowGraph,
  AgentWorkflowValidationIssue,
  AgentWorkflowNodeData,
  IntentRouterNodeData,
  SummarizerNodeData,
  RequirementAnalyzerNodeData,
  TaskPlannerNodeData,
  TaskChainNodeData,
  CollaborationRouterNodeData,
} from './types.js'
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
    if (node.type === 'agent-loop') {
      const d = node.data as AgentWorkflowNodeData
      if (!d.agentLoopTools || d.agentLoopTools.length === 0) {
        issues.push({ level: 'warning', nodeId: node.id, message: '智能体循环未选择可用工具，将退化为单轮 LLM 回答' })
      }
      if ((d.agentLoopMaxIterations ?? 8) < 1) {
        issues.push({ level: 'error', nodeId: node.id, message: '智能体循环最大迭代次数不能小于 1' })
      }
    }
    if (node.type === 'agent-team') {
      const d = node.data as AgentWorkflowNodeData
      if (!d.agentTeamMembers || d.agentTeamMembers.length === 0) {
        issues.push({ level: 'error', nodeId: node.id, message: 'Agent 团队节点成员列表为空' })
      }
      if ((d.agentTeamMaxRounds ?? 5) < 1) {
        issues.push({ level: 'error', nodeId: node.id, message: 'Agent 团队最大轮次不能小于 1' })
      }
    }
    if (node.type === 'memory-write') {
      const d = node.data as AgentWorkflowNodeData
      if (!d.memoryWriteContent?.trim()) {
        issues.push({ level: 'error', nodeId: node.id, message: '长程记忆写入节点内容为空' })
      }
    }
    if (node.type === 'memory-recall') {
      const d = node.data as AgentWorkflowNodeData
      if (!d.memoryRecallQuery?.trim()) {
        issues.push({ level: 'warning', nodeId: node.id, message: '长程记忆检索节点 query 为空，将使用默认值' })
      }
    }
    if (node.type === 'handoff') {
      const d = node.data as AgentWorkflowNodeData
      if (!d.handoffTargetWorkflowId?.trim()) {
        issues.push({ level: 'error', nodeId: node.id, message: '会话交接节点未选择目标 workflow' })
      }
    }
    if (node.type === 'code-execute') {
      const d = node.data as AgentWorkflowNodeData
      if (!d.codeScript?.trim()) {
        issues.push({ level: 'error', nodeId: node.id, message: '代码执行节点脚本为空' })
      }
    }
    if (node.type === 'variable-set') {
      const d = node.data as AgentWorkflowNodeData
      if (!d.variableName?.trim()) {
        issues.push({ level: 'error', nodeId: node.id, message: '变量赋值节点变量名为空' })
      }
    }
  }
  return issues
}
