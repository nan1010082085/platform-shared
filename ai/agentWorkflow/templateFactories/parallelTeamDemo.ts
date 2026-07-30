/**
 * Agent 工作流模板工厂 - parallelTeamDemo
 *
 * 并行团队分析：agent-team parallel 模式。
 * supervisor 自动拆解子任务 -> 多成员并行执行 -> 合成结论。
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

export function createParallelTeamDemoWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      { id: 'trigger-1', type: 'manual-trigger', position: { x: 80, y: 200 }, data: { label: '手动触发' } },
      {
        id: 'team-1',
        type: 'agent-team',
        position: { x: 320, y: 200 },
        data: {
          label: '并行团队分析',
          agentTeamMode: 'parallel',
          agentTeamMaxRounds: 5,
          agentTeamModel: 'default',
          agentTeamMembers: [
            { name: '数据分析师', persona: '从数据趋势和统计角度分析问题', model: 'default' },
            { name: '风险评估师', persona: '从风险和合规角度评估方案', model: 'default' },
            { name: '用户体验师', persona: '从用户体验和交互设计角度提出建议', model: 'default' },
          ],
        },
      },
      { id: 'end-1', type: 'end', position: { x: 580, y: 200 }, data: { label: '结束' } },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'team-1' },
      { id: 'e2', source: 'team-1', target: 'end-1' },
    ],
  })
}
