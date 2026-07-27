/**
 * Agent 工作流模板工厂 - smartActionProposals
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 智能拟办：Webhook 接收文档 → 解析 → LLM 提取行动项 → HITL 确认 → HTTP 通知 */
export function createSmartActionProposalsWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/smart-actions',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '文档解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '提取行动项',
          model: 'default',
          temperature: 0,
          systemPrompt:
            '你是项目管理专家，擅长从文档中提取可执行的行动项、待办事项、审批需求。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{\n  "documentTitle": "文档标题",\n  "summary": "文档摘要",\n  "actionItems": [\n    {\n      "id": "a1",\n      "title": "行动项标题",\n      "description": "详细描述",\n      "assignee": "建议负责人（如有）",\n      "deadline": "建议截止日期（如有）",\n      "priority": "high | medium | low",\n      "type": "todo | approval | review | decision"\n    }\n  ],\n  "approvalChain": ["审批人1", "审批人2"]\n}\n\n## 规则\n- type：todo=待办，approval=审批，review=评审，decision=决策\n- 无明确负责人/截止日期时填空字符串\n- 如果文档内容为空，返回 { "documentTitle": "", "summary": "文档为空", "actionItems": [], "approvalChain": [] }',
          prompt:
            '文件名：{{$node.parse-1.filename}}\n\n文档内容：\n{{$node.parse-1.text}}\n\n请提取所有行动项和审批需求。',
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 800, y: 200 },
        data: {
          label: '人工审核拟办',
          confirmMessage: '已从文档中提取行动项，请确认或修改后执行：',
          confirmQuestions: [
            { id: 'q1', question: '是否确认以上行动项？', options: ['确认', '需要修改', '取消'], required: true },
            { id: 'q2', question: '补充说明（可选）', required: false },
          ],
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 1040, y: 200 },
        data: {
          label: '用户是否确认',
          expression: "hitlResult && hitlResult.q1 === '确认'",
        },
      },
      {
        id: 'notify-1',
        type: 'tool',
        position: { x: 1240, y: 120 },
        data: {
          label: '通知外部系统',
          toolCategory: 'workflow',
          toolName: 'http__request',
          toolArgs: {
            url: '{{$input.callbackUrl}}',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
              workflowId: '{{$execution.workflowId}}',
              status: 'approved',
              actionItems: '{{$node.llm-1.actionItems}}',
              timestamp: '{{$now}}',
            },
          },
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1240, y: 300 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'hitl-1' },
      { id: 'e4', source: 'hitl-1', target: 'if-1' },
      { id: 'e5', source: 'if-1', target: 'notify-1', data: { branch: 'true' } },
      { id: 'e6', source: 'if-1', target: 'end-1', data: { branch: 'false' } },
      { id: 'e7', source: 'notify-1', target: 'end-1' },
    ],
  })
}
