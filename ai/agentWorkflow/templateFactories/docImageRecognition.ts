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
          systemPrompt:
            '你是图片识别助手。结合 OCR 文本与视觉描述，输出 JSON：{ "type": "image", "filename": "...", "summary": "...", "visualDescription": "...", "fields": [], "tables": [] }。只输出 JSON。',
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
          systemPrompt:
            '你是文档解析助手。根据文档正文，输出 JSON：{ "type": "document", "filename": "...", "summary": "...", "sections": [{"title":"","content":""}], "keyPoints": [] }。只输出 JSON，不要 markdown 代码块。',
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
