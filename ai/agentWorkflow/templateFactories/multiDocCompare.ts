/**
 * Agent 工作流模板工厂 - multiDocCompare
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 多文档对比：手动触发 -> 会话记忆 -> LLM 差异对比 -> 结束 */
export function createMultiDocCompareWorkflowGraph(): AgentWorkflowGraph {
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
        position: { x: 320, y: 200 },
        data: {
          label: '会话记忆',
          memoryMode: 'append',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '多文档对比',
          model: 'default',
          useConversationHistory: true,
          appendAssistantReply: true,
          systemPrompt:
            '你是文档对比专家。基于会话中累积的多份文档内容，输出差异对比、一致性检查与合并建议。\n\n输出 JSON：\n{\n  "differences": [{"topic": "", "docA": "", "docB": "", "conflict": true|false}],\n  "consistencyIssues": [],\n  "mergeSuggestions": []\n}\n只输出 JSON。',
          prompt:
            '当前输入：{{$input.message}}\n\n请结合历史文档进行多文档对比分析。',
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
      { id: 'e2', source: 'memory-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'end-1' },
    ],
  })
}
