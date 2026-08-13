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
          label: '描述看板需求',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '仪表盘分析与推荐',
          model: 'default',
          temperature: 0.3,
          systemPrompt:
            '你是大屏/仪表盘设计顾问。根据用户业务场景，给出可落地的指标、图表、布局与配色建议。\n\n## 输出格式（Markdown）\n\n## 推荐指标与图表\n- 列出 6～8 个核心指标，每个写清：指标含义、图表类型、为什么适合\n\n## 布局建议\n- 用二级标题按业务分区（如概览 / 转化 / 商品 / 异常）\n\n## 配色方案\n- 给出色板（含 hex）与主次用途\n\n## 告警与下一步\n- 若用户问到异常/告警，给出可执行规则；否则给 2～3 条落地步骤\n\n## 规则\n- 全程中文，具体可执行，避免空泛\n- 多轮时承接上文，不要重复整套开场\n- 需求不清时做合理假设并标明',
          prompt: '用户仪表盘需求：\n{{$input.message}}\n\n请给出完整、可落地的设计建议。',
          useConversationHistory: true,
          appendAssistantReply: true,
          maxHistoryTurns: 20,
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 560, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'llm-1' },
      { id: 'e2', source: 'llm-1', target: 'end-1' },
    ],
  })
}
