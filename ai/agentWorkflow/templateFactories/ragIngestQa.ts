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
          temperature: 0,
          systemPrompt:
            '你是文档质检专家，擅长判断文档内容是否适合写入知识库（检查完整性、实质信息、乱码/空白）。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{ "passed": boolean, "reason": "通过/不通过原因" }\n\n## 规则\n- passed=true：内容完整、有实质信息、无乱码\n- passed=false：内容为空、乱码、纯符号无意义文本\n- 如果文档内容为空，返回 { "passed": false, "reason": "文档内容为空" }',
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
        type: 'memory-write',
        position: { x: 1040, y: 100 },
        data: {
          label: '写入知识库记忆',
          memoryWriteContent:
            '质检通过入库：{{$node.parse-1.filename}}\n\n{{$node.parse-1.text}}',
          memoryWriteNamespace: 'fact',
          memoryWriteImportance: 0.6,
          memoryWriteUserIdSource: 'auto',
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
        type: 'memory-write',
        position: { x: 1520, y: 250 },
        data: {
          label: '强制入库记忆',
          memoryWriteContent:
            '人工强制入库：{{$node.parse-1.filename}}\n备注：{{$input.answers.q2}}\n\n{{$node.parse-1.text}}',
          memoryWriteNamespace: 'fact',
          memoryWriteImportance: 0.5,
          memoryWriteUserIdSource: 'auto',
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
