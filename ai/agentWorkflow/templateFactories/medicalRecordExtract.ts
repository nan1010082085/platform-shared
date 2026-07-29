/**
 * Agent 工作流模板工厂 - medicalRecordExtract
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'

/** 病历结构化提取工作流模板（Webhook -> 解析 -> LLM 结构化提取 -> 结束） */
export function createMedicalRecordExtractWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'webhook-1',
    nodes: [
      {
        id: 'webhook-1',
        type: 'webhook-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: 'Webhook 触发',
          webhookPath: '/medical-record-extract',
          webhookMethod: 'POST',
        },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 320, y: 200 },
        data: {
          label: '病历解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'llm-1',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '结构化提取',
          model: 'default',
          temperature: 0.1,
          systemPrompt:
            '你是病历结构化提取专家，从病历文本中提取关键字段，输出严格的 JSON。\n\n## 输出格式\n\n输出 JSON，不要输出其他内容：\n\n```\n{\n  "patientName": "患者姓名（如原文未提及则为空字符串）",\n  "chiefComplaint": "主诉",\n  "diagnosis": ["诊断1", "诊断2"],\n  "medications": [\n    { "name": "药品名", "dosage": "用法用量" }\n  ],\n  "examinations": ["检查项1", "检查项2"],\n  "notes": "医嘱/备注"\n}\n```\n\n## 规则\n- 字段缺失时：字符串为空、数组为空 []\n- 仅根据原文提取，不得推断或编造\n- 原文内容为空时输出空 JSON 对象 {}',
          prompt: '请从以下病历文本中结构化提取：\n\n文件名：{{$node.parse-1.filename}}\n\n正文：\n{{$node.parse-1.text}}',
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
