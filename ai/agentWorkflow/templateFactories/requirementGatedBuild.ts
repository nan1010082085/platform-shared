/**
 * Agent 工作流模板工厂 - requirementGatedBuild
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/**
 * 需求门控构建 — requirement-gated-build
 *
 * 图：manual-trigger → requirement-analyzer → hitl → task-planner
 *   → task-chain → expert(editor) → task-chain → expert(flow) → summarizer → end
 */
export function createRequirementGatedBuildWorkflowGraph(): AgentWorkflowGraph {
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
        id: 'req-analyzer-1',
        type: 'requirement-analyzer',
        position: { x: 360, y: 200 },
        data: {
          label: '需求分析',
          enableRag: true,
          enableTools: true,
          completenessThreshold: 80,
          model: 'default',
        },
      },
      {
        id: 'hitl-1',
        type: 'hitl',
        position: { x: 640, y: 200 },
        data: {
          label: '人工确认需求',
          confirmMessage: '请确认需求分析结果，确认后将按需求逐步构建',
          confirmQuestions: [
            { id: 'q1', question: '是否确认需求？', options: ['确认', '需要修改'], required: true },
          ],
        },
      },
      {
        id: 'task-planner-1',
        type: 'task-planner',
        position: { x: 920, y: 200 },
        data: {
          label: '任务规划',
          inputSource: 'requirementAnalysis',
          maxSteps: 8,
          strategy: 'sequential',
          model: 'default',
        },
      },
      {
        id: 'task-chain-editor',
        type: 'task-chain',
        position: { x: 1200, y: 200 },
        data: {
          label: '编辑器任务链',
          chainSource: 'upstream',
          staticChain: [],
          onStepOutput: '',
        },
      },
      {
        id: 'expert-editor',
        type: 'expert',
        position: { x: 1480, y: 200 },
        data: {
          label: '编辑器专家',
          agentType: 'editor',
          expertId: '',
        },
      },
      {
        id: 'task-chain-flow',
        type: 'task-chain',
        position: { x: 1760, y: 200 },
        data: {
          label: '流程任务链',
          chainSource: 'upstream',
          staticChain: [],
          onStepOutput: '',
        },
      },
      {
        id: 'expert-flow',
        type: 'expert',
        position: { x: 2040, y: 200 },
        data: {
          label: '流程专家',
          agentType: 'flow',
          expertId: '',
        },
      },
      {
        id: 'summarizer-1',
        type: 'summarizer',
        position: { x: 2320, y: 200 },
        data: {
          label: '摘要输出',
          summarySource: 'taskChain',
          customPrompt: '',
          stream: false,
          model: 'default',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 2600, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'req-analyzer-1' },
      { id: 'e2', source: 'req-analyzer-1', target: 'hitl-1' },
      { id: 'e3', source: 'hitl-1', target: 'task-planner-1' },
      { id: 'e4', source: 'task-planner-1', target: 'task-chain-editor' },
      { id: 'e5', source: 'task-chain-editor', target: 'expert-editor' },
      { id: 'e6', source: 'expert-editor', target: 'task-chain-flow' },
      { id: 'e7', source: 'task-chain-flow', target: 'expert-flow' },
      { id: 'e8', source: 'expert-flow', target: 'summarizer-1' },
      { id: 'e9', source: 'summarizer-1', target: 'end-1' },
    ],
  })
}
