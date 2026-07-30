/**
 * Agent 工作流模板工厂 - smartFormSearch
 *
 * 智能表单检索：演示 VR-4 结构化检索工具。
 * agent-loop 节点配 rag__search 工具，LLM 自主决定按字段/组件类型检索已有表单。
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

export function createSmartFormSearchWorkflowGraph(): AgentWorkflowGraph {
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
        id: 'loop-1',
        type: 'agent-loop',
        position: { x: 320, y: 200 },
        data: {
          label: '智能检索表单',
          model: 'default',
          agentLoopTools: ['rag__search'],
          agentLoopMaxIterations: 8,
          agentLoopInputSource: 'message',
          agentLoopSystemPrompt:
            '你是表单检索助手。用户会描述需求（如"找含手机号字段的表单"或"有没有审批流程表单"），你需要调用 rag__search 工具检索已有表单。\n\n## 工具使用\n- rag__search 支持 widgetTypes（组件类型如 input/select/mobile）、fieldNames（字段名如 phone/email）、entityKind（schema/flow/document）结构化过滤\n- 自然语言描述填 query，按需传 widgetTypes/fieldNames 精确筛选\n- 多次调用可组合检索（先语义搜，再按字段过滤）\n\n## 输出\n汇总检索到的表单（名称/字段/相似度），给出推荐与差异对比。直接输出中文文本。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 580, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'loop-1' },
      { id: 'e2', source: 'loop-1', target: 'end-1' },
    ],
  })
}
