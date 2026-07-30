/**
 * Agent 工作流模板工厂 - scheduledReport
 *
 * 定时报告：演示 schedule-trigger。
 * 每天 9 点触发 -> LLM 生成数据报告 -> 结束。
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

export function createScheduledReportWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'schedule-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: '每天 9 点触发',
          scheduleCron: '0 9 * * *',
          scheduleTimezone: 'Asia/Shanghai',
          scheduleEnabled: true,
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 340, y: 200 },
        data: {
          label: '生成数据报告',
          model: 'default',
          temperature: 0.3,
          systemPrompt:
            '你是数据分析师。根据输入生成结构化的数据日报，包含关键指标、趋势、异常与建议。输出中文，不要 markdown 代码块。',
          prompt: '请生成今日数据报告：\n{{$input.message}}',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 600, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'llm-1' },
      { id: 'e2', source: 'llm-1', target: 'end-1' },
    ],
  })
}
