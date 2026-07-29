/**
 * Agent 工作流模板工厂 - educationHomeworkGrading
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

/** 作业批改工作流模板（Webhook -> 解析 -> LLM 批改评分 -> 结束） */
export function createEducationHomeworkGradingWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/homework-grading',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '作业解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '批改评分',
          model: 'default',
          temperature: 0.2,
          systemPrompt:
            '你是严谨的教师，按评分标准批改学生作业，输出结构化 JSON。\n\n## 输出格式\n\n输出 JSON，不要输出其他内容：\n\n```\n{\n  "score": 85,\n  "total": 100,\n  "correct": ["题目1：正确"],\n  "wrong": [\n    { "question": "题目2", "studentAnswer": "学生答案", "correctAnswer": "正确答案", "analysis": "错误分析" }\n  ],\n  "comment": "总体评语，含鼓励与改进建议"\n}\n```\n\n## 规则\n- score 为整数，0-100\n- 客观题按对错判定，主观题按要点给分\n- 评语具体、正向，避免空话\n- 原文内容为空时输出 { "score": 0, "total": 100, "correct": [], "wrong": [], "comment": "作业内容为空" }',
          prompt: '请批改以下作业：\n\n文件名：{{$node.parse-1.filename}}\n\n作业内容：\n{{$node.parse-1.text}}',
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
