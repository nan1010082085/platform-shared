/**
 * Agent 工作流模板工厂 - memoryAssistant
 *
 * 记忆增强助手：演示长程记忆闭环。
 * 召回用户跨会话记忆 -> LLM 结合记忆回答 -> memory-extract 自动提取并沉淀新记忆。
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

export function createMemoryAssistantWorkflowGraph(): AgentWorkflowGraph {
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
        id: 'recall-1',
        type: 'memory-recall',
        position: { x: 240, y: 200 },
        data: {
          label: '召回长程记忆',
          memoryRecallQuery: '{{$input.message}}',
          memoryRecallLimit: 5,
          memoryRecallNamespace: 'all',
          memoryRecallUserIdSource: 'auto',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 440, y: 200 },
        data: {
          label: '结合记忆回答',
          model: 'default',
          temperature: 0.3,
          systemPrompt:
            '你是用户的个性化助手。结合召回的用户长程记忆（偏好/事实/事件）给出贴合用户的回答。\n\n## 输出格式\n\n直接输出中文回答文本，不要输出 JSON。\n\n## 规则\n- 优先利用记忆中的偏好/事实/事件给出个性化回答\n- 若无相关记忆，正常回答并保持一致风格\n- 不要编造记忆中不存在的事实\n- 记忆为空时直接回答当前问题',
          prompt:
            '用户长程记忆：\n{{$node.recall-1}}\n\n当前问题：{{$input.message}}\n\n请结合记忆回答：',
        },
      },
      {
        id: 'extract-1',
        type: 'memory-extract',
        position: { x: 640, y: 200 },
        data: {
          label: '提取并沉淀记忆',
          memoryExtractSource: 'lastOutput',
          memoryExtractModel: 'default',
          memoryExtractNamespace: 'fact',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 840, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'recall-1' },
      { id: 'e2', source: 'recall-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'extract-1' },
      { id: 'e4', source: 'extract-1', target: 'end-1' },
    ],
  })
}
