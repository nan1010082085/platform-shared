/**
 * Agent 工作流模板工厂 - switchDemo
 *
 * 条件分支演示：switch 节点按输入内容匹配分支，不同分支走不同 LLM 处理。
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

export function createSwitchDemoWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      { id: 'trigger-1', type: 'manual-trigger', position: { x: 80, y: 200 }, data: { label: '手动触发' } },
      {
        id: 'switch-1',
        type: 'switch',
        position: { x: 300, y: 200 },
        data: {
          label: '优先级分支',
          switchBranches: [
            { label: '紧急', expression: '紧急' },
            { label: '常规', expression: '常规' },
          ],
        },
      },
      {
        id: 'llm-urgent',
        type: 'llm',
        position: { x: 540, y: 120 },
        data: {
          label: '紧急处理',
          model: 'default',
          temperature: 0.2,
          systemPrompt: '你是紧急事务处理助手。快速分析并给出紧急处理建议。输出中文，不要 markdown 代码块。',
          prompt: '紧急事务：\n{{$input.message}}\n\n请给出紧急处理方案：',
        },
      },
      {
        id: 'llm-normal',
        type: 'llm',
        position: { x: 540, y: 280 },
        data: {
          label: '常规处理',
          model: 'default',
          temperature: 0.3,
          systemPrompt: '你是常规事务处理助手。给出详细的处理建议。输出中文，不要 markdown 代码块。',
          prompt: '事务：\n{{$input.message}}\n\n请给出处理建议：',
        },
      },
      { id: 'end-1', type: 'end', position: { x: 780, y: 200 }, data: { label: '结束' } },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'switch-1' },
      { id: 'e2', source: 'switch-1', target: 'llm-urgent', data: { branch: '紧急' } },
      { id: 'e3', source: 'switch-1', target: 'llm-normal', data: { branch: '常规' } },
      { id: 'e4', source: 'llm-urgent', target: 'end-1' },
      { id: 'e5', source: 'llm-normal', target: 'end-1' },
    ],
  })
}
