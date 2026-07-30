/**
 * Agent 工作流模板工厂 - codeExecuteDemo
 *
 * 代码执行演示：code-execute 节点沙箱执行 JavaScript，对输入数据做变换/计算。
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

export function createCodeExecuteDemoWorkflowGraph(): AgentWorkflowGraph {
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
        id: 'code-1',
        type: 'code-execute',
        position: { x: 320, y: 200 },
        data: {
          label: '数据变换',
          codeLanguage: 'javascript',
          codeScript:
            '// 对输入数据做处理，返回结果给下游节点\nconst input = $input;\nconst message = input?.message ?? \'\';\n\n// 示例：统计字数、提取关键词\nconst wordCount = message.length;\nconst hasNumbers = /\\d+/.test(message);\n\nreturn {\n  original: message,\n  wordCount,\n  hasNumbers,\n  summary: `输入共 ${wordCount} 字${hasNumbers ? \'，含数字\' : \'\'}`\n};',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: 'LLM 总结',
          model: 'default',
          temperature: 0.3,
          systemPrompt: '你是数据分析助手。根据代码执行结果生成简洁总结。输出中文。',
          prompt: '代码执行结果：\n{{$node.code-1}}\n\n请生成总结：',
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
      { id: 'e1', source: 'trigger-1', target: 'code-1' },
      { id: 'e2', source: 'code-1', target: 'llm-1' },
      { id: 'e3', source: 'llm-1', target: 'end-1' },
    ],
  })
}
