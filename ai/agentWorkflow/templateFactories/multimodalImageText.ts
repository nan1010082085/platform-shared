/**
 * Agent 工作流模板工厂 - multimodalImageText
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

/**
 * 图文素材生成：手动触发 → LLM 文案+配图 prompt → 结束
 *
 * 说明：完整链路本可接 image-generate；线上未配置图像生成模型/密钥时该节点会失败。
 * 模板先交付可试跑的文案与配图 prompt；模型中心就绪后可在图末追加 image-generate。
 */
export function createMultimodalImageTextWorkflowGraph(): AgentWorkflowGraph {
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
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '文案+配图 prompt 生成',
          model: 'default',
          temperature: 0.5,
          systemPrompt:
            '你是内容营销专家，擅长根据用户需求生成图文素材（正文文案+配图 prompt）。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{\n  "title": "标题",\n  "body": "正文文案",\n  "imagePrompts": ["配图1的画面描述", "配图2的画面描述"]\n}\n\n## 规则\n- imagePrompts 生成 2-4 条，每条描述一个具体画面场景\n- body 为中文正文，imagePrompts 为中文画面描述\n- 如果用户需求为空，返回 { "title": "", "body": "", "imagePrompts": [] }',
          prompt: '用户需求：{{$input.message}}\n\n请生成图文素材。',
        },
      },
      {
        id: 'llm-pack',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '整理交付稿',
          model: 'default',
          temperature: 0.2,
          systemPrompt:
            '你把上游 JSON 整理为可读的 Markdown 交付稿，包含标题、正文、配图 Prompt 列表。不要输出 JSON。',
          prompt: '上游输出：\n{{$node.llm-1.text}}\n\n请整理为交付稿。',
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
      { id: 'e1', source: 'trigger-1', target: 'llm-1' },
      { id: 'e2', source: 'llm-1', target: 'llm-pack' },
      { id: 'e3', source: 'llm-pack', target: 'end-1' },
    ],
  })
}
