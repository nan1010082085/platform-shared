/**
 * Agent 工作流模板工厂 - smartSuggestions
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 智能建议：收集上下文 → LLM 分析 → 条件判断 → HITL 确认 / 直接结束 */
export function createSmartSuggestionsWorkflowGraph(): AgentWorkflowGraph {
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
        position: { x: 280, y: 200 },
        data: {
          label: '读取上下文',
          memoryMode: 'read',
          maxHistoryTurns: 10,
        },
      },
      {
        id: 'rag-1',
        type: 'tool',
        position: { x: 480, y: 200 },
        data: {
          label: '检索相关 Schema',
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
        position: { x: 680, y: 200 },
        data: {
          label: '生成智能建议',
          model: 'default',
          temperature: 0.2,
          useConversationHistory: true,
          maxHistoryTurns: 10,
          systemPrompt:
            '你是 Schema 平台智能助手，擅长根据用户操作上下文、对话历史和检索结果，主动推荐下一步操作、优化方案或相关内容。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{\n  "suggestions": [\n    {\n      "type": "action | optimization | reference",\n      "title": "建议标题",\n      "description": "详细描述",\n      "priority": "high | medium | low",\n      "targetId": "相关 Schema/Flow ID（如有）"\n    }\n  ],\n  "contextSummary": "当前上下文摘要"\n}\n\n## 规则\n- 建议数量 1-5 条，按优先级排序\n- type：action=操作建议，optimization=优化建议，reference=参考内容\n- 如果无可用建议，返回 { "suggestions": [], "contextSummary": "暂无建议" }',
          prompt:
            '当前操作：{{$input.message}}\n\n对话历史：\n{{$conversation}}\n\n相关 Schema/Flow：\n{{$node.rag-1}}\n\n请生成智能建议。',
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 880, y: 200 },
        data: {
          label: '是否有建议',
          expression: 'lastOutput && lastOutput.suggestions && lastOutput.suggestions.length > 0',
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 1080, y: 120 },
        data: {
          label: '用户确认建议',
          confirmMessage: '根据您的操作上下文，我有以下建议，请选择采纳哪些：',
          confirmQuestions: [
            { id: 'q1', question: '采纳哪些建议？（输入建议编号，逗号分隔）', required: false },
            { id: 'q2', question: '有其他需求吗？', required: false },
          ],
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1080, y: 300 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'memory-1' },
      { id: 'e2', source: 'memory-1', target: 'rag-1' },
      { id: 'e3', source: 'rag-1', target: 'llm-1' },
      { id: 'e4', source: 'llm-1', target: 'if-1' },
      { id: 'e5', source: 'if-1', target: 'hitl-1', data: { branch: 'true' } },
      { id: 'e6', source: 'if-1', target: 'end-1', data: { branch: 'false' } },
      { id: 'e7', source: 'hitl-1', target: 'end-1' },
    ],
  })
}
