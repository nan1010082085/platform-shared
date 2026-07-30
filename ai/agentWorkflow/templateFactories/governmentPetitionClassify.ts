/**
 * Agent 工作流模板工厂 - governmentPetitionClassify
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

/** 政务诉求分类工作流模板（Webhook -> LLM 分类+派发建议 -> 结束） */
export function createGovernmentPetitionClassifyWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/petition-classify',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '诉求分类与派发',
          model: 'default',
          temperature: 0,
          systemPrompt:
            '你是政务诉求分流专家，擅长对群众诉求文本进行分类、判定紧急度并给出派发建议。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{\n  "category": "咨询 | 投诉 | 举报 | 建议 | 求助",\n  "subcategory": "细分类别（如户籍/环保/市政/教育）",\n  "urgency": "urgent | high | normal | low",\n  "department": "建议派发部门",\n  "summary": "一句话诉求摘要",\n  "suggestedAction": "处理建议",\n  "slaHours": 48\n}\n\n## 规则\n- category 只能是：咨询、投诉、举报、建议、求助\n- urgency：urgent(立即处理/危及安全) / high(24h) / normal(48h) / low(5工作日)\n- slaHours 与 urgency 对应：urgent=2, high=24, normal=48, low=120\n- 涉及安全/群体事件/舆情时 urgency 至少 high\n- 如果诉求内容为空，返回 { "category": "咨询", "subcategory": "", "urgency": "low", "department": "信访接待", "summary": "诉求内容为空", "suggestedAction": "联系诉求人补充信息", "slaHours": 120 }',
          prompt: '群众诉求文本：\n{{$input.message}}\n\n请完成分类、紧急度判定与派发建议。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 560, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'llm-1' },
      { id: 'e2', source: 'llm-1', target: 'end-1' },
    ],
  })
}
