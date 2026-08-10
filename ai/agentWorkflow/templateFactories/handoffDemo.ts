/**
 * Agent 工作流模板工厂 - handoffDemo
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

/**
 * 会话交接演示：手动触发 → LLM 分流说明 → handoff（目标来自 $input.targetWorkflowId）→ 结束
 *
 * 试跑时传入 input.targetWorkflowId = 已发布 workflow id。
 */
export function createHandoffDemoWorkflowGraph(): AgentWorkflowGraph {
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
          label: '交接前言',
          model: 'default',
          temperature: 0.2,
          systemPrompt:
            '你是会话路由助手。用一两句话说明将把用户请求交给专业工作流处理。不要输出 JSON。',
          prompt: '用户请求：{{$input.message}}\n目标工作流：{{$input.targetWorkflowId}}\n\n请写交接前言。',
        },
      },
      {
        id: 'handoff-1',
        type: 'handoff',
        position: { x: 560, y: 200 },
        data: {
          label: '交接目标工作流',
          handoffTargetWorkflowId: '{{$input.targetWorkflowId}}',
          handoffInputTemplate: '{{$input.message}}',
          handoffPassHistory: true,
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
      { id: 'e2', source: 'llm-1', target: 'handoff-1' },
      { id: 'e3', source: 'handoff-1', target: 'end-1' },
    ],
  })
}
