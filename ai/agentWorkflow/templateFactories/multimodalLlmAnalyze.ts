/**
 * Agent 工作流模板工厂 - multimodalLlmAnalyze
 *
 * 多模态图文分析：演示 llm 节点 attachImages（MM-2 图文混合）。
 * 上传图片 + 文字描述 -> llm 节点（注入 image_url 多模态）-> 输出结构化分析。
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

export function createMultimodalLlmAnalyzeWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 200 },
        data: { label: '手动触发（附图片）' },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 340, y: 200 },
        data: {
          label: '图文混合分析',
          model: 'default',
          temperature: 0.3,
          attachImages: true,
          systemPrompt:
            '你是多模态分析助手。结合上传的图片与文字描述，给出结构化分析。\n\n## 输出格式\n\n直接输出中文分析文本，不要 markdown 代码块。\n\n## 规则\n- 优先依据图片实际内容分析，结合用户文字描述\n- 描述图片中的关键元素、布局、文字、数据\n- 如图片与描述不符，以图片为准并指出差异',
          prompt: '请分析上传的图片内容，并结合以下用户描述给出结论：\n{{$input.message}}',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 600, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'llm-1' },
      { id: 'e2', source: 'llm-1', target: 'end-1' },
    ],
  })
}
