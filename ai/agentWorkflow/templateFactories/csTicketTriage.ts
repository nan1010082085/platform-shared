/**
 * Agent 工作流模板工厂 - csTicketTriage
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 客服工单智能分流：Webhook 接收工单 → LLM 分类 → 条件分流 → 结束 */
export function createCsTicketTriageWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: '接收工单',
          webhookPath: '/cs-ticket-triage',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '工单分类',
          model: 'default',
          systemPrompt:
            '你是客服工单分流助手。根据工单文本判断类别、优先级与建议处理团队。\n\n类别 category 只能是：咨询、投诉、退款、技术。\n优先级 priority 只能是：high、medium、low。\nsuggestedTeam 为建议团队名称（如「售前咨询」「客诉专员」「退款组」「技术支持」）。\n\n输出 JSON：\n{\n  "category": "咨询|投诉|退款|技术",\n  "priority": "high|medium|low",\n  "suggestedTeam": "...",\n  "summary": "一句话摘要",\n  "needsSpecialist": true/false\n}\n\n投诉、退款或明确技术故障时 needsSpecialist=true。只输出 JSON。',
          prompt:
            '工单文本：\n{{$input.message}}\n\n请完成分流分类。',
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 560, y: 200 },
        data: {
          label: '是否需专员',
          expression:
            "lastOutput && (lastOutput.needsSpecialist === true || lastOutput.priority === 'high' || lastOutput.category === '投诉' || lastOutput.category === '退款')",
        },
      },
      {
        id: 'end-specialist',
        type: 'end',
        position: { x: 800, y: 120 },
        data: {
          label: '专员队列',
          outputSource: 'node',
          outputNodeId: 'llm-1',
        },
      },
      {
        id: 'end-general',
        type: 'end',
        position: { x: 800, y: 280 },
        data: {
          label: '普通队列',
          outputSource: 'node',
          outputNodeId: 'llm-1',
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'llm-1' },
      { id: 'e2', source: 'llm-1', target: 'if-1' },
      { id: 'e3', source: 'if-1', target: 'end-specialist', data: { branch: 'true' } },
      { id: 'e4', source: 'if-1', target: 'end-general', data: { branch: 'false' } },
    ],
  })
}
