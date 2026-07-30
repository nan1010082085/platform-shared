/**
 * Agent 工作流模板工厂 - legalCaseSummary
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

/** 案件摘要提取工作流模板（Webhook -> 解析 -> LLM 结构化摘要 -> 结束） */
export function createLegalCaseSummaryWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/legal-case-summary',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '案件文档解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '案件摘要提取',
          model: 'default',
          temperature: 0.1,
          systemPrompt:
            '你是法律案件分析专家，从案件文本中提取关键要素，输出严格的 JSON。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块，不要任何解释：\n\n```\n{\n  "caseType": "案件类型（民事/刑事/行政/仲裁）",\n  "parties": [\n    { "role": "原告/被告/申请人/被申请人", "name": "名称" }\n  ],\n  "claims": ["诉讼请求或诉求要点"],\n  "facts": ["关键事实"],\n  "legalIssues": ["争议法律焦点"],\n  "evidence": ["提及的证据"],\n  "conclusion": "案件结论或当前阶段"\n}\n```\n\n## 规则\n- 字段缺失时：字符串为空、数组为空 []\n- 仅根据原文提取，不得推断或编造\n- 原文内容为空时输出空 JSON 对象 {}',
          prompt: '请从以下案件文本中提取结构化摘要：\n\n文件名：{{$node.parse-1.filename}}\n\n正文：\n{{$node.parse-1.text}}',
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
