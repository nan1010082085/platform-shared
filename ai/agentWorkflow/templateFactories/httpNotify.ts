/**
 * Agent 工作流模板工厂 - httpNotify
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** HTTP 回调通知：手动触发 → LLM 处理 → HTTP POST 结果 → 结束 */
export function createHttpNotifyWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/process-and-notify',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '内容处理',
          model: 'default',
          systemPrompt: '你是数据处理助手。对输入内容进行分析和摘要，输出结构化 JSON 结果。',
          prompt: '请处理以下输入并输出结构化结果：\n\n{{$input}}',
        },
      },
      {
        id: 'notify-1',
        type: 'tool',
        position: { x: 560, y: 200 },
        data: {
          label: 'HTTP 回调通知',
          toolCategory: 'workflow',
          toolName: 'http__request',
          toolArgs: {
            url: '{{$input.callbackUrl}}',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
              workflowId: '{{$execution.workflowId}}',
              status: 'completed',
              result: '{{$node.llm-1}}',
              timestamp: '{{$now}}',
            },
          },
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
      { id: 'e1', source: 'webhook-1', target: 'llm-1' },
      { id: 'e2', source: 'llm-1', target: 'notify-1' },
      { id: 'e3', source: 'notify-1', target: 'end-1' },
    ],
  })
}
