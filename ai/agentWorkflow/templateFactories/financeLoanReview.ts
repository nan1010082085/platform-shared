/**
 * Agent 工作流模板工厂 - financeLoanReview
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

/** 贷款风险评估工作流模板（Webhook -> LLM 风险评估 -> 结束） */
export function createFinanceLoanReviewWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/loan-review',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '贷款风险评估',
          model: 'default',
          temperature: 0.1,
          systemPrompt:
            '你是信贷风险评估专家，根据贷款申请信息评估信用与还款能力。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{\n  "riskScore": 0,\n  "riskLevel": "low | medium | high",\n  "riskFactors": [\n    { "factor": "风险因素", "severity": "low | medium | high", "detail": "说明" }\n  ],\n  "approvalAdvice": "approve | review | reject",\n  "suggestedTerms": { "maxAmount": "建议最高额度", "rate": "建议利率", "termMonths": 0 },\n  "reason": "综合评估理由"\n}\n\n## 规则\n- riskScore 为 0-100 整数（越高风险越大）\n- riskLevel：low(<40) / medium(40-69) / high(>=70)\n- approvalAdvice：approve(low) / review(medium) / reject(high)\n- 严格基于申请信息，不得编造收入/资产数据\n- 申请信息为空时返回 { "riskScore": 100, "riskLevel": "high", "riskFactors": [{"factor":"信息缺失","severity":"high","detail":"申请信息为空"}], "approvalAdvice": "reject", "suggestedTerms": {"maxAmount":"0","rate":"","termMonths":0}, "reason": "申请信息为空，无法评估" }',
          prompt: '贷款申请信息：\n{{$input.message}}\n\n请评估信用风险并给出审批建议。',
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
