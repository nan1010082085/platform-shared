/**
 * Agent 工作流模板工厂 - ragIngestQa
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** RAG 入库质检：Webhook 接收文档 → 解析 → LLM 质检 → 判断是否合格 → 合格入库 / 不合格人工审核 */
export function createRagIngestQaWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/rag-ingest-qa',
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
        id: 'llm-qa',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '内容质量检查',
          model: 'default',
          systemPrompt:
            '你是文档质检员。检查文档内容是否适合入库：内容是否完整、是否有实质信息、是否为乱码或空白。输出 JSON：{ "passed": true/false, "reason": "..." }。只输出 JSON。',
          prompt:
            '文件名：{{$node.parse-1.filename}}\n\n文档内容：\n{{$node.parse-1.text}}\n\n请判断该文档是否适合写入知识库。',
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 800, y: 200 },
        data: {
          label: '质检是否通过',
          expression: "lastOutput && lastOutput.passed === true",
        },
      },
      {
        id: 'rag-ingest',
        type: 'tool',
        position: { x: 1040, y: 100 },
        data: {
          label: '写入知识库',
          toolCategory: 'mcp-rag',
          toolName: 'rag__ingest',
          toolArgs: {
            content: '{{$node.parse-1.text}}',
            metadata: { source: 'qa-passed', filename: '{{$node.parse-1.filename}}' },
          },
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 1040, y: 300 },
        data: {
          label: '人工审核',
          confirmMessage: '文档「{{$node.parse-1.filename}}」质检未通过，原因：{{$node.llm-qa.reason}}。请确认是否仍要入库？',
          confirmQuestions: [
            { id: 'q1', question: '是否强制入库？', options: ['入库', '丢弃'], required: true },
            { id: 'q2', question: '备注说明', required: false },
          ],
        },
      },
      {
        id: 'if-hitl',
        type: 'if',
        position: { x: 1280, y: 300 },
        data: {
          label: '用户选择',
          expression: "hitlResult && hitlResult.q1 === '入库'",
        },
      },
      {
        id: 'rag-ingest-force',
        type: 'tool',
        position: { x: 1520, y: 250 },
        data: {
          label: '强制入库',
          toolCategory: 'mcp-rag',
          toolName: 'rag__ingest',
          toolArgs: {
            content: '{{$node.parse-1.text}}',
            metadata: { source: 'qa-manual-override', filename: '{{$node.parse-1.filename}}' },
          },
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1520, y: 400 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'webhook-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'llm-qa' },
      { id: 'e3', source: 'llm-qa', target: 'if-1' },
      { id: 'e4', source: 'if-1', target: 'rag-ingest', data: { branch: 'true' } },
      { id: 'e5', source: 'if-1', target: 'hitl-1', data: { branch: 'false' } },
      { id: 'e6', source: 'rag-ingest', target: 'end-1' },
      { id: 'e7', source: 'hitl-1', target: 'if-hitl' },
      { id: 'e8', source: 'if-hitl', target: 'rag-ingest-force', data: { branch: 'true' } },
      { id: 'e9', source: 'if-hitl', target: 'end-1', data: { branch: 'false' } },
      { id: 'e10', source: 'rag-ingest-force', target: 'end-1' },
    ],
  })
}
