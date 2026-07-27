/**
 * Agent 工作流模板工厂 - feedbackAnalysis
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 客户反馈分析：手动触发 → RAG 检索反馈数据 → LLM 批量分析（情感+主题）→ 汇总报告 */
export function createFeedbackAnalysisWorkflowGraph(): AgentWorkflowGraph {
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
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '反馈数据汇总',
          model: 'default',
          systemPrompt: '你从上下文中获取客户反馈数据，整理为结构化列表。如果上下文没有数据，提示用户输入反馈内容。',
          prompt: '请整理以下客户反馈数据：\n\n{{$input.message}}',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '情感与主题分析',
          model: 'default',
          systemPrompt:
            '你是数据分析专家。对客户反馈进行情感分类和主题提取。\n\n输出 JSON：\n{\n  "summary": { "total": 0, "positive": 0, "neutral": 0, "negative": 0 },\n  "topThemes": [{"theme": "", "count": 0, "sentiment": ""}],\n  "insights": [],\n  "actionItems": []\n}\n只输出 JSON。',
          prompt: '客户反馈数据：\n{{$node.rag-1.text}}\n\n请进行情感分析和主题提取。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 800, y: 200 },
        data: {
          label: '输出报告',
          outputSource: 'node',
          outputNodeId: 'llm-1',
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'rag-1' },
      { id: 'e2', source: 'rag-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'end-1' },
    ],
  })
}
