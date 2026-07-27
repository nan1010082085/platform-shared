/**
 * Agent 工作流模板工厂 - contractExtract
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
export function createContractExtractWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/contract-extract',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '合同文档解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '条款结构化提取',
          model: 'default',
          temperature: 0,
          systemPrompt:
            '你是合同分析专家，擅长从合同文本中提取关键条款与风险点。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{\n  "parties": ["合同方名称"],\n  "effectiveDate": "生效日期 YYYY-MM-DD 或 null",\n  "expiryDate": "到期日期 YYYY-MM-DD 或 null",\n  "totalAmount": "合同金额（含币种）",\n  "paymentTerms": "付款条款",\n  "keyClauses": [{"clause": "条款名称", "content": "条款内容摘要", "riskLevel": "low | medium | high"}],\n  "risks": ["风险点描述"]\n}\n\n## 规则\n- 日期无法提取时填 null，不要编造\n- riskLevel：high=重大法律风险，medium=需关注，low=常规条款\n- 如果合同内容为空，所有字段填 null 或空数组',
          prompt:
            '文件名：{{$node.parse-1.filename}}\n\n合同正文：\n{{$node.parse-1.text}}\n\n请提取所有关键条款与潜在风险点。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 800, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'end-1' },
    ],
  })
}
