/**
 * Agent 工作流模板工厂 - contractRiskTag
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 合同风险标注：手动触发 -> 解析 -> LLM 风险标注 -> HITL 确认 -> 结束 */
export function createContractRiskTagWorkflowGraph(): AgentWorkflowGraph {
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
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '合同解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '风险标注',
          model: 'default',
          systemPrompt:
            '你是合同风险分析专家。识别合同中的风险条款并标注等级。\n\n输出 JSON：\n{\n  "overallRisk": "low|medium|high",\n  "clauses": [{"clause": "", "riskLevel": "low|medium|high", "issue": ""}],\n  "recommendations": []\n}\n只输出 JSON。',
          prompt:
            '文件名：{{$node.parse-1.filename}}\n\n合同正文：\n{{$node.parse-1.text}}\n\n请标注风险条款。',
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 800, y: 200 },
        data: {
          label: '人工确认',
          confirmMessage:
            '整体风险等级：{{$node.llm-1.overallRisk}}。请确认风险标注并决定是否放行。',
          confirmQuestions: [
            { id: 'q1', question: '处理方式', options: ['放行', '退回修改', '升级法务'], required: true },
            { id: 'q2', question: '备注', required: false },
          ],
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1040, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'hitl-1' },
      { id: 'e4', source: 'hitl-1', target: 'end-1' },
    ],
  })
}
