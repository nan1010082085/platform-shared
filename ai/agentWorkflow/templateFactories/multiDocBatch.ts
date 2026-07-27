/**
 * Agent 工作流模板工厂 - multiDocBatch
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 多文档批量处理：Webhook 接收文档列表 → 解析 → LLM 摘要 → 汇总 → 结束 */
export function createMultiDocBatchWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/multi-doc-batch',
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
        id: 'llm-single',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '单文档摘要',
          model: 'default',
          systemPrompt: '你是文档摘要助手。为每篇文档生成简洁的中文摘要，提取关键信息。输出 JSON：{ "filename": "...", "summary": "...", "keyPoints": [] }。只输出 JSON。',
          prompt:
            '文件名：{{$node.parse-1.filename}}\n\n文档内容：\n{{$node.parse-1.text}}\n\n请生成摘要。',
        },
      },
      {
        id: 'memory-1',
        type: 'conversation-memory',
        position: { x: 800, y: 200 },
        data: {
          label: '追加摘要到记忆',
          memoryMode: 'append',
          memoryRole: 'assistant',
          contentSource: 'lastOutput',
          maxHistoryTurns: 50,
        },
      },
      {
        id: 'llm-summary',
        type: 'llm',
        position: { x: 1040, y: 200 },
        data: {
          label: '汇总所有摘要',
          model: 'default',
          systemPrompt: '你是文档汇总助手。根据已处理的所有文档摘要，生成一份综合报告。输出 JSON：{ "totalDocuments": N, "summaries": [...], "overallSummary": "...", "commonThemes": [] }。只输出 JSON。',
          prompt: '已处理的文档摘要：\n{{$conversation}}\n\n请生成综合汇总报告。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1280, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-single' },
      { id: 'e3', source: 'llm-single', target: 'memory-1' },
      { id: 'e4', source: 'memory-1', target: 'llm-summary' },
      { id: 'e5', source: 'llm-summary', target: 'end-1' },
    ],
  })
}
