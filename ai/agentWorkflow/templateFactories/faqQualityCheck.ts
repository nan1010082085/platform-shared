/**
 * Agent 工作流模板工厂 - faqQualityCheck
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** FAQ 质检：Webhook -> LLM 质检 -> if 不合格 -> HITL / 直接结束 */
export function createFaqQualityCheckWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: '接收 FAQ',
          webhookPath: '/faq-quality-check',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: 'FAQ 质检',
          model: 'default',
          systemPrompt:
            '你是 FAQ 质检员。检查问答对的准确性、完整性与表述清晰度。\n\n输出 JSON：\n{\n  "passed": true|false,\n  "accuracy": 0.0-1.0,\n  "completeness": 0.0-1.0,\n  "clarity": 0.0-1.0,\n  "issues": [],\n  "suggestedAnswer": ""\n}\n存在明显问题或任一维度低于 0.6 时 passed=false。只输出 JSON。',
          prompt: 'FAQ 条目：\n{{$input.faq}}\n\n请进行质检。',
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 560, y: 200 },
        data: {
          label: '是否合格',
          expression: 'lastOutput && lastOutput.passed === false',
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 800, y: 120 },
        data: {
          label: '人工复核',
          confirmMessage:
            'FAQ 质检未通过（accuracy={{$node.llm-1.accuracy}}）。问题：{{$node.llm-1.issues}}。建议答案：{{$node.llm-1.suggestedAnswer}}',
          confirmQuestions: [
            { id: 'q1', question: '处理方式', options: ['采纳建议', '人工改写', '驳回'], required: true },
            { id: 'q2', question: '备注', required: false },
          ],
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 800, y: 280 },
        data: {
          label: '结束',
          outputSource: 'node',
          outputNodeId: 'llm-1',
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'llm-1' },
      { id: 'e2', source: 'llm-1', target: 'if-1' },
      { id: 'e3', source: 'if-1', target: 'hitl-1', data: { branch: 'true' } },
      { id: 'e4', source: 'if-1', target: 'end-1', data: { branch: 'false' } },
      { id: 'e5', source: 'hitl-1', target: 'end-1' },
    ],
  })
}
