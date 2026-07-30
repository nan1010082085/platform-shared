/**
 * Agent 工作流模板工厂 - voteDecision
 *
 * 投票决策：演示 agent-team vote 模式（AG-vote）。
 * 多个成员对同一问题独立给方案，supervisor 仲裁选最佳或综合各方优点。
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

export function createVoteDecisionWorkflowGraph(): AgentWorkflowGraph {
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
        id: 'team-1',
        type: 'agent-team',
        position: { x: 320, y: 200 },
        data: {
          label: '团队投票决策',
          agentTeamMode: 'vote',
          agentTeamMaxRounds: 5,
          agentTeamModel: 'default',
          agentTeamSystemPrompt: '',
          agentTeamMembers: [
            { name: '产品经理', persona: '从用户价值与产品体验角度评估方案', model: 'default' },
            { name: '技术架构师', persona: '从技术可行性、成本与风险角度评估方案', model: 'default' },
            { name: '运营专家', persona: '从落地执行、运营成本与推广角度评估方案', model: 'default' },
          ],
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 580, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'team-1' },
      { id: 'e2', source: 'team-1', target: 'end-1' },
    ],
  })
}
