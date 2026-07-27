/**
 * Agent 工作流模板工厂 - csKbReply
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 客服知识库回复：手动触发 → RAG 检索 → LLM 生成回复草稿 → 结束 */
export function createCsKbReplyWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 200 },
        data: { label: '手动触发' },
      },
      {
        id: 'rag-1',
        type: 'tool',
        position: { x: 320, y: 200 },
        data: {
          label: '知识库检索',
          toolCategory: 'mcp-rag',
          toolName: 'rag__search',
          toolArgs: {
            query: '{{$input.message}}',
            limit: 5,
          },
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '生成回复草稿',
          model: 'default',
          temperature: 0.2,
          systemPrompt:
            '你是客服回复专家，擅长根据知识库检索结果为客户问题起草专业、礼貌的中文回复草稿。\n\n## 输出格式\n\n直接输出回复正文文本，不要输出 JSON。\n\n## 规则\n- 回复需基于知识库检索结果，不要编造信息\n- 若检索无相关内容，明确说明并给出可转人工的建议\n- 语气专业、礼貌，使用中文\n- 不要附加元说明（如"以下为回复："等）',
          prompt:
            '客户问题：{{$input.message}}\n\n知识库检索结果：\n{{$node.rag-1}}\n\n请生成客服回复草稿。',
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
      { id: 'e1', source: 'trigger-1', target: 'rag-1' },
      { id: 'e2', source: 'rag-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'end-1' },
    ],
  })
}
