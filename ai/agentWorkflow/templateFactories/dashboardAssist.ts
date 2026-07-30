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
            'You are a dashboard design expert. Based on the user\'s dashboard requirements, provide specific recommendations for chart types, layout, and color schemes.\n\n## Output Format\n\nOutput Markdown with the following sections:\n\n## Recommended Chart Types\n- List recommended chart types for each data dimension with reasons\n\n## Layout Suggestion\n- Describe recommended dashboard layout (grid, sections, zones)\n\n## Color Scheme\n- Recommend color palette (with hex codes)\n\n## Widget Composition\n- List recommended widgets and their data source configuration\n\n## Rules\n- Base recommendations on the user\'s actual data and use case\n- Provide specific, actionable suggestions (not generic advice)\n- Consider responsive layout (desktop/mobile)\n- If requirements are unclear, make reasonable assumptions and note them',
          prompt: 'Dashboard requirements:\n{{$input.message}}\n\nPlease provide comprehensive dashboard design recommendations.',
        },
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
