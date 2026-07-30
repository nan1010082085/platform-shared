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
        id: 'summarize-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '反馈数据汇总',
          model: 'default',
          temperature: 0.2,
          systemPrompt: '你是数据整理助手，从用户输入中整理客户反馈数据为结构化列表。\n\n## 输出格式\n\n直接输出整理后的文本（每条反馈一行），不要输出 JSON。\n\n## 规则\n- 去重并保留原文关键信息\n- 如果输入为空，输出"反馈数据为空，请输入客户反馈内容"',
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
          temperature: 0,
          systemPrompt:
            '你是客户反馈分析专家，擅长对客户反馈进行情感分类和主题提取。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{\n  "summary": { "total": 0, "positive": 0, "neutral": 0, "negative": 0 },\n  "topThemes": [{"theme": "主题名", "count": 0, "sentiment": "positive | neutral | negative"}],\n  "insights": ["关键洞察"],\n  "actionItems": ["行动建议"]\n}\n\n## 规则\n- summary 各计数为整数，total = positive + neutral + negative\n- topThemes 按出现频率排序，最多 10 个主题\n- 如果反馈数据为空，返回 { "summary": {"total":0,"positive":0,"neutral":0,"negative":0}, "topThemes": [], "insights": [], "actionItems": [] }',
          prompt: '客户反馈数据：\n{{$node.summarize-1.text}}\n\n请进行情感分析和主题提取。',
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
      { id: 'e1', source: 'trigger-1', target: 'summarize-1' },
      { id: 'e2', source: 'summarize-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'end-1' },
    ],
  })
}
