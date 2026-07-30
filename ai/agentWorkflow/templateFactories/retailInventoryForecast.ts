/**
 * Agent 工作流模板工厂 - retailInventoryForecast
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

/** 库存补货预测工作流模板（Webhook -> LLM 库存分析 -> 结束） */
export function createRetailInventoryForecastWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/inventory-forecast',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '库存分析与补货',
          model: 'default',
          temperature: 0.1,
          systemPrompt:
            '你是零售库存分析专家，根据库存数据预测缺货风险并给出补货建议。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{\n  "summary": { "totalSkus": 0, "lowStock": 0, "outOfStock": 0, "healthy": 0 },\n  "restockList": [\n    { "sku": "商品编码", "name": "商品名", "currentStock": 0, "suggestedQty": 0, "urgency": "urgent | high | normal", "reason": "补货理由" }\n  ],\n  "insights": ["库存洞察"],\n  "suggestions": ["采购/调拨建议"]\n}\n\n## 规则\n- suggestedQty 基于当前库存与历史销量推算，为整数\n- urgency：urgent(已缺货) / high(<=安全库存) / normal(偏低)\n- 库存数据为空时返回 { "summary": {"totalSkus":0,"lowStock":0,"outOfStock":0,"healthy":0}, "restockList": [], "insights": ["库存数据为空"], "suggestions": [] }',
          prompt: '库存数据（CSV/JSON 文本）：\n{{$input.message}}\n\n请分析缺货风险并输出补货建议。',
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
