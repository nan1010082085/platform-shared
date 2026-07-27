/**
 * Agent 工作流模板工厂 - multimodalVideoPromo
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 视频营销生成：手动触发 -> LLM 生成视频脚本 -> 视频生成 -> 结束 */
export function createMultimodalVideoPromoWorkflowGraph(): AgentWorkflowGraph {
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
          label: '视频脚本生成',
          model: 'default',
          systemPrompt:
            '你是视频脚本编剧。根据用户需求生成一段 6-15 秒短视频的画面描述脚本，适合营销/宣传。\n\n输出 JSON：\n{\n  "title": "视频标题",\n  "videoPrompt": "详细的画面描述，包含场景、主体、动作、氛围",\n  "duration": 8\n}\nduration 取 6-15 之间的整数。只输出 JSON。',
          prompt: '用户需求：{{$input.message}}\n\n请生成视频脚本。',
        },
      },
      {
        id: 'video-1',
        type: 'video-generate',
        position: { x: 560, y: 200 },
        data: {
          label: '视频生成',
          videoPrompt: '{{$node.llm-1.videoPrompt}}',
          videoModel: '',
          duration: 8,
          resolution: '720p',
          pollIntervalMs: 5000,
          pollTimeoutMs: 300000,
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
      { id: 'e2', source: 'llm-1', target: 'video-1' },
      { id: 'e3', source: 'video-1', target: 'end-1' },
    ],
  })
}
