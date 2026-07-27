/**
 * Agent 工作流模板工厂 - intelligentAssistant
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 智能助手问答编排：用户提问 → RAG 检索 → LLM 生成回答 */
export function createIntelligentAssistantWorkflowGraph(): AgentWorkflowGraph {
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
        id: 'memory-1',
        type: 'conversation-memory',
        position: { x: 240, y: 200 },
        data: {
          label: '记录用户问题',
          memoryMode: 'append',
          memoryRole: 'user',
          messageField: 'message',
          maxHistoryTurns: 20,
        },
      },
      {
        id: 'rag-1',
        type: 'tool',
        position: { x: 400, y: 200 },
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
        position: { x: 600, y: 200 },
        data: {
          label: '生成回答',
          model: 'default',
          useConversationHistory: true,
          appendAssistantReply: true,
          maxHistoryTurns: 20,
          systemPrompt:
            '你是 Schema 平台智能助手。根据知识库检索结果与对话历史回答用户问题，语气简洁专业。若检索无相关内容，说明未找到并给出可操作建议。回答使用中文。',
          prompt:
            '对话历史：\n{{$conversation}}\n\n当前问题：{{$input.message}}\n\n知识库检索结果：\n{{$node.rag-1}}\n\n请给出完整回答。',
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
      { id: 'e1', source: 'trigger-1', target: 'memory-1' },
      { id: 'e2', source: 'memory-1', target: 'rag-1' },
      { id: 'e3', source: 'rag-1', target: 'llm-1' },
      { id: 'e4', source: 'llm-1', target: 'end-1' },
    ],
  })
}
