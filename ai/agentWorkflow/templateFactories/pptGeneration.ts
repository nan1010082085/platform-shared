/**
 * Agent 工作流模板工厂 - pptGeneration
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** PPT 生成：手动触发 → LLM 大纲 → LLM 逐页内容 → LLM 汇总 → 结束 */
export function createPptGenerationWorkflowGraph(): AgentWorkflowGraph {
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
          maxHistoryTurns: 5,
        },
      },
      {
        id: 'llm-outline',
        type: 'llm',
        position: { x: 480, y: 200 },
        data: {
          label: '生成 PPT 大纲',
          model: 'default',
          systemPrompt:
            '你是演示文稿设计专家。根据用户需求生成 PPT 大纲。输出 JSON：\n{\n  "title": "演示文稿标题",\n  "template": "business|tech|education|creative",\n  "totalSlides": 10,\n  "slides": [\n    {\n      "index": 1,\n      "type": "title|content|chart|comparison|summary",\n      "heading": "页面标题",\n      "keyPoints": ["要点1", "要点2"],\n      "speakerNotes": "演讲者备注"\n    }\n  ]\n}\n\n页数控制在 8~15 页。只输出 JSON。',
          prompt: '用户需求：{{$input.message}}\n\n对话上下文：\n{{$conversation}}\n\n请生成 PPT 大纲。',
        },
      },
      {
        id: 'llm-detail',
        type: 'llm',
        position: { x: 720, y: 200 },
        data: {
          label: '生成每页详细内容',
          model: 'default',
          systemPrompt:
            '你是演示文稿内容专家。根据大纲为每一页生成详细的文案内容。输出 JSON：\n{\n  "title": "演示文稿标题",\n  "slides": [\n    {\n      "index": 1,\n      "type": "title",\n      "heading": "标题",\n      "subtitle": "副标题",\n      "content": ["要点1详细内容", "要点2详细内容"],\n      "speakerNotes": "演讲者备注",\n      "layout": "center|left|two-column|full-image"\n    }\n  ]\n}\n\n每页 content 不超过 5 个要点，每点不超过 50 字。只输出 JSON。',
          prompt: 'PPT 大纲：\n{{$node.llm-outline}}\n\n请生成每页详细内容。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 960, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'memory-1' },
      { id: 'e2', source: 'memory-1', target: 'llm-outline' },
      { id: 'e3', source: 'llm-outline', target: 'llm-detail' },
      { id: 'e4', source: 'llm-detail', target: 'end-1' },
    ],
  })
}
