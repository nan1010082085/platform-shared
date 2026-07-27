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
          temperature: 0,
          systemPrompt:
            '你是合同风险分析专家，擅长识别合同中的风险条款并标注等级。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{\n  "overallRisk": "low | medium | high",\n  "clauses": [{"clause": "条款名称", "riskLevel": "low | medium | high", "issue": "风险问题描述"}],\n  "recommendations": ["整改建议"]\n}\n\n## 规则\n- overallRisk 取所有条款中最高风险等级\n- riskLevel：high=重大法律/财务风险，medium=需法务关注，low=常规风险\n- 无风险条款也需列出，riskLevel 标为 low\n- 如果合同内容为空，返回 { "overallRisk": "low", "clauses": [], "recommendations": ["合同内容为空，无法分析"] }',
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
