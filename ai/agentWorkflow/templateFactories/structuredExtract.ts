/**
 * Agent 工作流模板工厂 - structuredExtract
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 结构化字段提取：Webhook -> 解析 -> LLM 按 schema 提取 JSON -> 结束 */
export function createStructuredExtractWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/structured-extract',
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
          label: '字段结构化提取',
          model: 'default',
          temperature: 0,
          systemPrompt:
            '你是信息提取专家，擅长从文档中按指定字段 schema 提取结构化数据。\n\n## 输出格式\n\n只输出 JSON 对象，不要 markdown 代码块。字段缺失时填 null，不要编造。\n\n## 规则\n- 严格按照用户提供的 schema 字段提取，不多不少\n- 数值字段用 number，日期字段用 "YYYY-MM-DD" 格式，布尔字段用 boolean\n- 如果文档内容为空，所有字段填 null\n- 如果未提供 schema，提取文档中所有可识别的关键信息',
          prompt:
            '文件名：{{$node.parse-1.filename}}\n\n文档内容：\n{{$node.parse-1.text}}\n\n提取字段 schema：{{$input.schema}}\n\n请输出结构化 JSON。',
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
