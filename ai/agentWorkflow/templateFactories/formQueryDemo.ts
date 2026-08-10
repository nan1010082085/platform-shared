/**
 * Agent 工作流模板工厂 - formQueryDemo
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

/**
 * 表单查询演示：手动触发 → form-query（schemaId 来自输入）→ LLM 解读 → 结束
 *
 * 试跑时传入 input.schemaId；可选 input.filter（如 status=submitted）。
 */
export function createFormQueryDemoWorkflowGraph(): AgentWorkflowGraph {
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
        id: 'form-query-1',
        type: 'form-query',
        position: { x: 320, y: 200 },
        data: {
          label: '查询表单提交',
          formQuerySchemaId: '{{$input.schemaId}}',
          formQueryFilter: '{{$input.filter}}',
          formQueryLimit: 10,
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '解读查询结果',
          model: 'default',
          temperature: 0.2,
          systemPrompt:
            '你是数据分析助手。根据表单查询结果给出简要统计与要点（条数、状态分布、异常）。用 Markdown，不要编造数据。',
          prompt:
            '用户问题：{{$input.message}}\n\n查询结果：\n{{$node.form-query-1}}\n\n请解读。',
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
      { id: 'e1', source: 'trigger-1', target: 'form-query-1' },
      { id: 'e2', source: 'form-query-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'end-1' },
    ],
  })
}
