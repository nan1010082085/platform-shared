/**
 * Agent 工作流模板工厂 - kbFaq
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 知识库 FAQ 生成：手动触发 → 文档解析 → LLM 生成问答对 → RAG 写入 → 结束 */
export function createKbFaqWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/kb-faq',
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
          label: '生成 FAQ 问答对',
          model: 'default',
          systemPrompt:
            '你是知识库内容专家。根据文档内容生成高质量的 FAQ 问答对。输出 JSON 数组：[{ "question": "...", "answer": "..." }]。问题应覆盖文档核心知识点，答案简洁准确。生成 5~15 对。只输出 JSON。',
          prompt:
            '文档标题：{{$node.parse-1.filename}}\n\n文档内容：\n{{$node.parse-1.text}}\n\n请生成 FAQ 问答对。',
        },
      },
      {
        id: 'rag-write',
        type: 'tool',
        position: { x: 800, y: 200 },
        data: {
          label: '写入知识库',
          toolCategory: 'mcp-rag',
          toolName: 'rag__ingest',
          toolArgs: {
            content: '{{$node.llm-1}}',
            metadata: { source: 'faq-generated', filename: '{{$node.parse-1.filename}}' },
          },
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1040, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'rag-write' },
      { id: 'e4', source: 'rag-write', target: 'end-1' },
    ],
  })
}
