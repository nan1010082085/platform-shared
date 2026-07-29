/**
 * Agent 工作流模板工厂 - imageTextGeneration
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 图文生成：手动触发 → LLM 文案 → LLM 图片 Prompt → LLM 图文合并 → 结束 */
export function createImageTextGenerationWorkflowGraph(): AgentWorkflowGraph {
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
        id: 'llm-outline',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '生成文案大纲',
          model: 'default',
          temperature: 0.5,
          systemPrompt:
            '你是内容创作专家，擅长根据用户需求生成图文内容的大纲和文案。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{\n  "title": "文章标题",\n  "style": "公众号 | 产品介绍 | 营销素材",\n  "sections": [\n    {\n      "heading": "段落标题",\n      "content": "文案内容",\n      "imagePrompt": "配图描述（英文 prompt，用于图片生成）",\n      "imagePosition": "top | bottom | left | right"\n    }\n  ],\n  "summary": "整体摘要"\n}\n\n## 规则\n- sections 至少 2 个段落\n- imagePrompt 必须是英文，描述具体画面场景\n- 如果用户需求为空，返回单段默认内容',
          prompt: '用户需求：\n{{$input.message}}\n\n请生成图文内容大纲（JSON）。',
        },
      },
      {
        id: 'llm-content',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '生成完整文案',
          model: 'default',
          temperature: 0.5,
          systemPrompt:
            '你是专业文案编辑，擅长根据大纲生成完整、流畅、有吸引力的文案内容。\n\n## 输出格式\n\n直接输出 Markdown 格式文案，不要输出 JSON。保持原文结构，优化措辞和可读性。',
          prompt:
            '大纲：\n{{$node.llm-outline}}\n\n请生成完整文案。',
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
      { id: 'e1', source: 'trigger-1', target: 'llm-outline' },
      { id: 'e2', source: 'llm-outline', target: 'llm-content' },
      { id: 'e3', source: 'llm-content', target: 'end-1' },
    ],
  })
}
