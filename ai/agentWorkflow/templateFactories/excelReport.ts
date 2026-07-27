/**
 * Agent 工作流模板工厂 - excelReport
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** Excel 报表洞察：Webhook 接收 Excel/CSV -> 解析 -> LLM 生成摘要与洞察 -> 结束 */
export function createExcelReportWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/excel-report',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: 'Excel/CSV 解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '报表洞察生成',
          model: 'default',
          systemPrompt:
            '你是数据分析专家。基于解析后的表格文本，生成数据摘要、关键趋势、异常点与行动建议。\n\n输出 JSON：\n{\n  "summary": "整体摘要",\n  "metrics": [{"name": "", "value": "", "trend": "up|down|flat"}],\n  "anomalies": [],\n  "recommendations": []\n}\n只输出 JSON，不要 markdown 代码块。',
          prompt:
            '文件名：{{$node.parse-1.filename}}\n\n表格内容：\n{{$node.parse-1.text}}\n\n请生成报表洞察。',
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
