/**
 * Agent 工作流模板工厂 - dashboardAssist
 *
 * 大屏 AI 辅助：分析用户需求，推荐图表类型、布局方案、配色方案。
 * 输出结构化 Markdown 建议，editor 前端可渲染并应用。
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

export function createDashboardAssistWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Describe Dashboard',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: 'Dashboard Analysis & Recommendation',
          model: 'default',
          temperature: 0.3,
          systemPrompt:
            '你是大屏/仪表盘设计顾问。根据用户的业务场景，给出可落地的图表、布局与配色建议。\n\n## 输出格式（Markdown）\n\n## 推荐图表类型\n- 按数据维度列出图表类型与理由\n\n## 布局建议\n- 分区、栅格、主次层级\n\n## 配色方案\n- 给出色板（含 hex）\n\n## 组件构成\n- 推荐组件及其数据来源思路\n\n## 规则\n- 基于用户真实场景，具体可执行，避免空泛\n- 考虑桌面/移动自适应\n- 需求不清时做合理假设并标明\n- 用中文回答',
          prompt: '用户仪表盘需求：\n{{$input.message}}\n\n请给出完整、可落地的设计建议。',
          useConversationHistory: true,
          appendAssistantReply: true,
          maxHistoryTurns: 20,        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 560, y: 200 },
        data: { label: 'End' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'llm-1' },
      { id: 'e2', source: 'llm-1', target: 'end-1' },
    ],
  })
}
