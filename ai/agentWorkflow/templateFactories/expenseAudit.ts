/**
 * Agent 工作流模板工厂 - expenseAudit
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 报销单审核：Webhook 接收凭证 → 文档解析 → LLM 核对金额/合规 → 条件分支（合规/异常）→ 异常走 HITL */
export function createExpenseAuditWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: '接收报销单',
          webhookPath: '/expense-audit',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '凭证解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '合规审核',
          model: 'default',
          temperature: 0,
          systemPrompt:
            '你是财务审核专家，擅长核对报销单的金额、项目、票据合规性。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{\n  "compliant": boolean,\n  "totalAmount": number,\n  "items": [{"description": "项目描述", "amount": number, "compliant": boolean, "reason": "合规/不合规原因"}],\n  "anomalies": ["异常项描述"],\n  "suggestion": "approve | reject | need_review"\n}\n\n## 规则\n- 金额需逐项核对，totalAmount 为各项合计\n- 票据缺失或金额异常的 item 标记 compliant=false\n- 存在异常项时 suggestion=need_review\n- 如果内容为空，返回 { "compliant": false, "totalAmount": 0, "items": [], "anomalies": ["报销单内容为空"], "suggestion": "reject" }',
          prompt: '报销单内容：\n{{$node.parse-1.text}}\n\n请进行合规审核。',
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 800, y: 200 },
        data: {
          label: '是否合规',
          expression: 'lastOutput && lastOutput.suggestion === "need_review"',
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 1040, y: 120 },
        data: {
          label: '人工复核',
          confirmMessage: '报销单存在异常项：{{$node.llm-1.anomalies}}。总金额：{{$node.llm-1.totalAmount}}元。请确认处理方式。',
          confirmQuestions: [
            { id: 'q1', question: '处理方式', options: ['批准', '驳回', '要求补充材料'], required: true },
            { id: 'q2', question: '备注', required: false },
          ],
        },
      },
      {
        id: 'end-pass',
        type: 'end',
        position: { x: 1040, y: 280 },
        data: { label: '审核通过', outputSource: 'node', outputNodeId: 'llm-1' },
      },
      {
        id: 'end-review',
        type: 'end',
        position: { x: 1280, y: 120 },
        data: { label: '人工处理完成' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'if-1' },
      { id: 'e4', source: 'if-1', target: 'hitl-1', data: { branch: 'true' } },
      { id: 'e5', source: 'if-1', target: 'end-pass', data: { branch: 'false' } },
      { id: 'e6', source: 'hitl-1', target: 'end-review' },
    ],
  })
}
