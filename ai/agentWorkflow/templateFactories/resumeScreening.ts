/**
 * Agent 工作流模板工厂 - resumeScreening
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

/** 简历筛选：Webhook 接收简历 → 文档解析 → LLM 提取关键信息 → LLM 匹配岗位评分 → 结构化输出 */
export function createResumeScreeningWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: '接收简历',
          webhookPath: '/resume-screening',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '简历解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '信息提取与评分',
          model: 'default',
          systemPrompt:
            '你是资深 HR。从简历中提取关键信息，与岗位要求匹配后打分。\n\n输出 JSON：\n{\n  "candidate": { "name": "", "education": "", "experience": "", "skills": [] },\n  "matchScore": 0-100,\n  "strengths": [],\n  "weaknesses": [],\n  "recommendation": "strong_yes|yes|maybe|no",\n  "reason": ""\n}\n只输出 JSON。',
          prompt:
            '岗位要求：\n{{$input.jobRequirements || "未指定岗位要求，请按通用标准评估"}}\n\n简历内容：\n{{$node.parse-1.text}}\n\n请提取信息并评分。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 800, y: 200 },
        data: {
          label: '输出结果',
          outputSource: 'node',
          outputNodeId: 'llm-1',
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'end-1' },
    ],
  })
}
