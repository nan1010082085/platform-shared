/**
 * Agent 工作流模板工厂 - manufacturingQualityReport
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

/** 质检报告生成工作流模板（Webhook -> 解析 -> LLM 异常分析+报告 -> 结束） */
export function createManufacturingQualityReportWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/quality-report',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '质检数据解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '异常分析+报告',
          model: 'default',
          temperature: 0.2,
          systemPrompt:
            '你是制造业质检数据分析专家，根据质检数据生成结构化 Markdown 报告。\n\n## 输出格式\n\n## 质检概览\n- 检测总数 / 合格数 / 不合格数 / 合格率\n\n## 异常项清单\n| 项目 | 标准值 | 实测值 | 偏差 | 严重程度 |\n\n## 不合格原因分析\n- 按异常类型归类，分析根因\n\n## 改进建议\n- 针对性改进措施（按优先级排序）\n\n## 规则\n- 数据为空时输出"质检数据为空，无法生成报告"\n- 严格基于数据，不得编造数值\n- 合格率 = 合格数 / 检测总数 * 100%，保留 1 位小数',
          prompt: '请根据以下质检数据生成报告：\n\n文件名：{{$node.parse-1.filename}}\n\n数据：\n{{$node.parse-1.text}}',
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
