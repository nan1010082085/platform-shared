/**
 * Agent 工作流模板工厂 - csSentimentEscalate
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 情绪检测与升级：Webhook 接收消息 → LLM 情绪分析 → 负面则 HITL，否则直接结束 */
export function createCsSentimentEscalateWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: '接收消息',
          webhookPath: '/cs-sentiment-escalate',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: {
          label: '情绪分析',
          model: 'default',
          systemPrompt:
            '你是客服情绪分析助手。判断客户消息的情绪倾向与是否需要人工升级。\n\n输出 JSON：\n{\n  "sentiment": "positive|neutral|negative",\n  "score": 0.0-1.0,\n  "reason": "简要理由",\n  "needsEscalation": true/false\n}\n\nsentiment=negative 或出现强烈不满/威胁投诉时 needsEscalation=true。只输出 JSON。',
          prompt: '客户消息：\n{{$input.message}}\n\n请分析情绪。',
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 560, y: 200 },
        data: {
          label: '是否负面升级',
          expression:
            "lastOutput && (lastOutput.needsEscalation === true || lastOutput.sentiment === 'negative')",
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 800, y: 120 },
        data: {
          label: '人工审核升级',
          confirmMessage:
            '检测到负面情绪（{{$node.llm-1.sentiment}}，score={{$node.llm-1.score}}）。原因：{{$node.llm-1.reason}}。请确认是否升级人工处理？',
          confirmQuestions: [
            { id: 'q1', question: '处理方式', options: ['升级人工', '自动安抚后关闭'], required: true },
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
