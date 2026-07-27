/**
 * Agent 工作流模板工厂 - imageAnalysis
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/**
 * 图片智能分析 — 两阶段架构
 *
 * Phase 1 — 小图快速提取（400px, quality 50）
 *   vision-analyze → 3行结构化 → LLM 解析 JSON（dateTime, category, location）
 *
 * Phase 2 — 大图深度生成（1024px, quality 85）
 *   emotion 路径：vision-analyze 大图 → LLM 融合地点上下文生成情感文案
 *   event/info 路径：LLM 基于 Phase 1 元数据生成摘要
 */
export function createImageAnalysisWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 200 },
        data: {
          label: '图片分析触发',
        },
      },
      // ── Phase 1：小图快速提取 ──
      {
        id: 'vision-phase1',
        type: 'vision-analyze',
        position: { x: 320, y: 200 },
        data: {
          label: 'Phase1 · 小图提取（400px）',
          documentSource: 'stream',
          streamField: 'image',
          visionImageWidth: 400,
          visionImageQuality: 50,
          visionPrompt: `Analyze this image and respond in EXACTLY three lines:
Line 1: 日期时间 → "YYYY-MM-DD HH:mm" 或 "NONE"
Line 2: 分类 → emotion / event / info
Line 3: 地点推断 → 短语如 "咖啡馆" 或 "UNKNOWN"

Only output the three lines, nothing else.`,
        },
      },
      {
        id: 'llm-parse',
        type: 'llm',
        position: { x: 560, y: 200 },
        data: {
          label: '解析结构化数据',
          model: 'default',
          systemPrompt:
            '你是文本解析助手。将3行文本解析为 JSON。只输出 JSON，不要任何解释。',
          prompt: `解析以下3行文本为 JSON：

{{$node.vision-phase1.description}}

输出格式：
{
  "dateTime": "YYYY-MM-DD HH:mm" 或 null,
  "category": "emotion" | "event" | "info",
  "location": "地点描述" 或 null
}`,
        },
      },
      {
        id: 'if-1',
        type: 'if',
        position: { x: 800, y: 200 },
        data: {
          label: '分类判断',
          expression: "lastOutput && lastOutput.category === 'emotion'",
        },
      },
      // ── Phase 2 emotion：大图深度分析 ──
      {
        id: 'vision-phase2',
        type: 'vision-analyze',
        position: { x: 1040, y: 80 },
        data: {
          label: 'Phase2 · 大图情感分析（1024px）',
          documentSource: 'stream',
          streamField: 'image',
          visionImageWidth: 1024,
          visionImageQuality: 85,
          visionPrompt: `你正在看一张高清照片。
地点：{{$node.llm-parse.location}}，时间：{{$node.llm-parse.dateTime}}

用第一人称描述这张照片带给你的感受。
要求：一句话，30到50个字，融入地点和时间的氛围。
仿佛你就是按下快门的那个人，正在回忆这个瞬间。`,
        },
      },
      {
        id: 'llm-emotion',
        type: 'llm',
        position: { x: 1280, y: 80 },
        data: {
          label: '情感文案润色',
          model: 'default',
          systemPrompt: '你是情感文案助手。将粗糙的感受润色为优美的一句话。',
          prompt: `原始感受：{{$node.vision-phase2.description}}
地点：{{$node.llm-parse.location}}，时间：{{$node.llm-parse.dateTime}}

要求：
- 一句话，30到50个字
- 用自己的语言，禁止复制原文
- 融入地点氛围，仿佛你就是写下这些文字的人
直接输出润色后的一句话。`,
        },
      },
      // ── Phase 2 non-emotion：元数据摘要 ──
      {
        id: 'llm-event',
        type: 'llm',
        position: { x: 1040, y: 320 },
        data: {
          label: '事件/信息摘要',
          model: 'default',
          systemPrompt: '你是场景描述助手。',
          prompt: `分类：{{$node.llm-parse.category}}
地点：{{$node.llm-parse.location}}，时间：{{$node.llm-parse.dateTime}}

如果分类是 event：用第一人称叙述发生了什么，一句话，30到50字，融入地点氛围。
如果分类是 info：客观摘要关键信息，一句话，30到50字。

直接输出一句话。`,
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 1520, y: 200 },
        data: {
          label: '结束',
          outputSource: 'lastOutput',
        },
      },
    ],
    edges: [
      // Phase 1
      { id: 'e1', source: 'trigger-1', target: 'vision-phase1' },
      { id: 'e2', source: 'vision-phase1', target: 'llm-parse' },
      { id: 'e3', source: 'llm-parse', target: 'if-1' },
      // Phase 2 emotion 路径
      { id: 'e4', source: 'if-1', target: 'vision-phase2', data: { branch: 'true' } },
      { id: 'e5', source: 'vision-phase2', target: 'llm-emotion' },
      { id: 'e6', source: 'llm-emotion', target: 'end-1' },
      // Phase 2 event/info 路径
      { id: 'e7', source: 'if-1', target: 'llm-event', data: { branch: 'false' } },
      { id: 'e8', source: 'llm-event', target: 'end-1' },
    ],
  })
}
