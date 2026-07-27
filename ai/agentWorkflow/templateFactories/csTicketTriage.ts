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
          temperature: 0,
          systemPrompt:
            '你是客服工单分流专家，擅长根据工单文本判断类别、优先级与建议处理团队。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{\n  "category": "咨询 | 投诉 | 退款 | 技术",\n  "priority": "high | medium | low",\n  "suggestedTeam": "建议团队名称",\n  "summary": "一句话摘要",\n  "needsSpecialist": false\n}\n\n## 规则\n- category 只能是：咨询、投诉、退款、技术\n- priority 只能是：high、medium、low\n- suggestedTeam：咨询->售前咨询，投诉->客诉专员，退款->退款组，技术->技术支持\n- 投诉、退款或明确技术故障时 needsSpecialist=true\n- 如果工单内容为空，返回 { "category": "咨询", "priority": "low", "suggestedTeam": "售前咨询", "summary": "工单内容为空", "needsSpecialist": false }',
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
