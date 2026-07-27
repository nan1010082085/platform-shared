/**
 * Agent 工作流模板工厂 - documentSummary
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 文档解析 + 摘要工作流模板（Webhook → 解析 → LLM 摘要 → 结束） */
export function createDocumentSummaryWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/document-summary',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '文档解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '生成摘要',
          model: 'default',
          temperature: 0.2,
          systemPrompt:
            '你是文档摘要专家，擅长根据解析后的文档内容生成简洁、结构化的中文摘要。\n\n## 输出格式\n\n直接输出 Markdown 格式摘要文本，不要输出 JSON。摘要应包含：\n- 核心主题（1-2 句话）\n- 关键要点（3-5 条）\n- 结论或建议（如有）\n\n## 规则\n- 如果文档内容为空，输出"文档内容为空，无法生成摘要"',
          prompt: '请为以下文档生成结构化摘要：\n\n文件名：{{$node.parse-1.filename}}\n\n正文：\n{{$node.parse-1.text}}',
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
