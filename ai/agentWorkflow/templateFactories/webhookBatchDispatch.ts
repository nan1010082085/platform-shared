/**
 * Agent 工作流模板工厂 - webhookBatchDispatch
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 批量任务分发：Webhook -> 任务规划 -> 任务链 -> 摘要汇总 -> 结束 */
export function createWebhookBatchDispatchWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/batch-dispatch',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'task-planner-1',
        type: 'task-planner',
        position: { x: 320, y: 200 },
        data: {
          label: '任务规划',
          inputSource: 'message',
          maxSteps: 8,
          strategy: 'sequential',
          model: 'default',
        },
      },
      {
        id: 'task-chain-1',
        type: 'task-chain',
        position: { x: 560, y: 200 },
        data: {
          label: '任务链执行',
          chainSource: 'upstream',
          staticChain: [],
          onStepOutput: '',
        },
      },
      {
        id: 'summarizer-1',
        type: 'summarizer',
        position: { x: 800, y: 200 },
        data: {
          label: '结果汇总',
          summarySource: 'taskChain',
          customPrompt: '',
          stream: false,
          model: 'default',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1040, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'task-planner-1' },
      { id: 'e2', source: 'task-planner-1', target: 'task-chain-1' },
      { id: 'e3', source: 'task-chain-1', target: 'summarizer-1' },
      { id: 'e4', source: 'summarizer-1', target: 'end-1' },
    ],
  })
}
