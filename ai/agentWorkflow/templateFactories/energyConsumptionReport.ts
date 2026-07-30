/**
 * Agent 工作流模板工厂 - energyConsumptionReport
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

/** 能耗分析报告工作流模板（Webhook -> 解析 -> LLM 异常分析+节能建议 -> 结束） */
export function createEnergyConsumptionReportWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/energy-report',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '能耗数据解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '能耗分析与节能建议',
          model: 'default',
          temperature: 0.2,
          systemPrompt:
            '你是能耗分析专家，根据能耗数据生成结构化 Markdown 报告。\n\n## 输出格式\n\n## 能耗概览\n- 总能耗 / 峰值时段 / 日均能耗\n\n## 异常用电\n| 时段 | 实际能耗 | 预期能耗 | 偏差率 | 可能原因 |\n\n## 节能空间\n- 按设备/时段识别节能潜力\n\n## 节能建议\n- 针对性措施（按节能潜力排序，含预估节省比例）\n\n## 规则\n- 数据为空时输出"能耗数据为空，无法生成报告"\n- 严格基于数据，不得编造数值\n- 偏差率 = (实际-预期)/预期 * 100%，保留 1 位小数',
          prompt: '请根据以下能耗数据生成分析报告：\n\n文件名：{{$node.parse-1.filename}}\n\n数据：\n{{$node.parse-1.text}}',
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
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'end-1' },
    ],
  })
}
