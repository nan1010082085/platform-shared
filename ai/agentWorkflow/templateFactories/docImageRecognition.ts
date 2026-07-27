/**
 * Agent 工作流模板工厂 - docImageRecognition
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/** 文档 / 图片识别编排：上传文件流 → 解析 → 按 OCR/文档分支结构化提取 */
export function createDocImageRecognitionWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 220 },
        data: { label: '手动触发' },
      },
      {
        id: 'parse-1',
        type: 'document-parse',
        position: { x: 280, y: 220 },
        data: {
          label: '文档/图片解析',
          documentSource: 'stream',
          streamField: 'file',
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 480, y: 220 },
        data: {
          label: '是否图片 OCR',
          expression: "lastOutput && lastOutput.extractionMethod === 'ocr'",
        },
      },
      {
        id: 'vision-1',
        type: 'vision-analyze',
        position: { x: 680, y: 120 },
        data: {
          label: '图片视觉描述',
          documentSource: 'stream',
          streamField: 'file',
          visionPrompt:
            '描述图片中的场景、UI/表单布局、图表与视觉结构。文字内容可简要概括，重点不是逐字 OCR。',
        },
      },
      {
        id: 'llm-image',
        type: 'llm',
        position: { x: 880, y: 120 },
        data: {
          label: '图片结构化识别',
          model: 'default',
          temperature: 0,
          systemPrompt:
            '你是图片识别专家，擅长结合 OCR 文本与视觉描述输出结构化信息。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{ "type": "image", "filename": "文件名", "summary": "图片摘要", "visualDescription": "视觉描述", "fields": ["识别到的字段"], "tables": ["表格内容"] }\n\n## 规则\n- 如果 OCR 和视觉描述都为空，所有字段填空字符串或空数组',
          prompt:
            'OCR 文本：{{$node.parse-1.text}}\n\n视觉描述：{{$node.vision-1.description}}\n\n请输出结构化 JSON。',
        },
      },
      {
        id: 'llm-doc',
        type: 'llm',
        position: { x: 680, y: 320 },
        data: {
          label: '文档结构化提取',
          model: 'default',
          temperature: 0,
          systemPrompt:
            '你是文档解析专家，擅长根据文档正文提取章节摘要与关键信息。\n\n## 输出格式\n\n只输出 JSON，不要 markdown 代码块。输出 schema：\n{ "type": "document", "filename": "文件名", "summary": "文档摘要", "sections": [{"title": "章节标题", "content": "章节内容"}], "keyPoints": ["关键信息"] }\n\n## 规则\n- 如果文档内容为空，返回 { "type": "document", "filename": "", "summary": "文档为空", "sections": [], "keyPoints": [] }',
          prompt:
            '文件名：{{$node.parse-1.filename}}\n\n解析结果：\n{{$node.parse-1.text}}\n\n请提取章节摘要与关键信息。',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1080, y: 220 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'parse-1' },
      { id: 'e2', source: 'parse-1', target: 'if-1' },
      { id: 'e3', source: 'if-1', target: 'vision-1', data: { branch: 'true' } },
      { id: 'e4', source: 'if-1', target: 'llm-doc', data: { branch: 'false' } },
      { id: 'e5', source: 'vision-1', target: 'llm-image' },
      { id: 'e6', source: 'llm-image', target: 'end-1' },
      { id: 'e7', source: 'llm-doc', target: 'end-1' },
    ],
  })
}
