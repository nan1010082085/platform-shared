/**
 * Agent 工作流模板工厂 - contentCompliance
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 内容合规审查：Webhook -> LLM 合规审查 -> if 违规 -> HITL / 直接结束 */
export function createContentComplianceWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: '接收内容',
          webhookPath: '/content-compliance',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '合规审查',
          model: 'default',
          systemPrompt:
            '你是内容合规审查员。判断内容是否违反法律法规、平台政策或品牌规范。\n\n输出 JSON：\n{\n  "compliant": true|false,\n  "violations": [{"type": "law|policy|brand", "detail": ""}],\n  "severity": "none|low|medium|high",\n  "suggestion": ""\n}\n只输出 JSON。',
          prompt: '待审查内容：\n{{$input.content}}\n\n请进行合规审查。',
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 560, y: 200 },
        data: {
          label: '是否违规',
          expression: 'lastOutput && lastOutput.compliant === false',
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 800, y: 120 },
        data: {
          label: '人工审核',
          confirmMessage:
            '检测到合规风险（severity={{$node.llm-1.severity}}）。违规项：{{$node.llm-1.violations}}。请确认处理方式。',
          confirmQuestions: [
            { id: 'q1', question: '处理方式', options: ['驳回', '放行', '改写后放行'], required: true },
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
