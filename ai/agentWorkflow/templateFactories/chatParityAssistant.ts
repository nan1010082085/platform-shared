/**
 * Agent 工作流模板工厂 - chatParityAssistant
 */

import type { AgentWorkflowGraph } from '../types.js'
import { layoutAgentWorkflowGraph } from '../defaults.js'
/**
 * 智能助手 v2 — chat-parity-assistant
 *
 * 图：manual-trigger → intent-router
 *   →|needsAnalysis| requirement-analyzer → hitl → task-planner → task-chain → expert → collaboration-router
 *     →|continue| expert  (协作循环)
 *     →|nextStep| task-chain  (下一任务)
 *     →|summarize| summarizer → end
 *   →|matched| expert  (快捷路径)
 */
export function createChatParityAssistantWorkflowGraph(): AgentWorkflowGraph {
  return layoutAgentWorkflowGraph({
    entryNodeId: 'trigger-1',
    nodes: [
      {
        id: 'trigger-1',
        type: 'manual-trigger',
        position: { x: 80, y: 260 },
        data: { label: '手动触发' },
      },
      {
        id: 'intent-router-1',
        type: 'intent-router',
        position: { x: 320, y: 260 },
        data: {
          label: '意图路由',
          routingMode: 'auto',
          enableMultiIntentChain: false,
          fallbackExpertId: '',
        },
      },
      {
        id: 'req-analyzer-1',
        type: 'requirement-analyzer',
        position: { x: 600, y: 160 },
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
        position: { x: 880, y: 160 },
        data: {
          label: '人工确认',
          confirmMessage: '请确认需求分析结果是否准确，是否需要补充信息',
          confirmQuestions: [
            { id: 'q1', question: '需求是否完整？', options: ['确认', '需要补充'], required: true },
          ],
        },
      },
      {
        id: 'task-planner-1',
        type: 'task-planner',
        position: { x: 1160, y: 160 },
        data: {
          label: '任务规划',
          inputSource: 'requirementAnalysis',
          maxSteps: 8,
          strategy: 'sequential',
          model: 'default',
        },
      },
      {
        id: 'task-chain-1',
        type: 'task-chain',
        position: { x: 1440, y: 160 },
        data: {
          label: '任务链',
          chainSource: 'upstream',
          staticChain: [],
          onStepOutput: '',
        },
      },
      {
        id: 'expert-1',
        type: 'expert',
        position: { x: 1440, y: 360 },
        data: {
          label: '专家执行',
          agentType: 'auto',
        },
      },
      {
        id: 'collab-router-1',
        type: 'collaboration-router',
        position: { x: 1720, y: 260 },
        data: {
          label: '协作路由',
          detectCollaborationTool: true,
          maxCollaborationRounds: 5,
        },
      },
      {
        id: 'summarizer-1',
        type: 'summarizer',
        position: { x: 2000, y: 360 },
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
        position: { x: 2280, y: 360 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'intent-router-1' },
      // needsAnalysis 分支
      { id: 'e2', source: 'intent-router-1', target: 'req-analyzer-1', sourceHandle: 'needsAnalysis' },
      { id: 'e3', source: 'req-analyzer-1', target: 'hitl-1' },
      { id: 'e4', source: 'hitl-1', target: 'task-planner-1' },
      { id: 'e5', source: 'task-planner-1', target: 'task-chain-1' },
      { id: 'e6', source: 'task-chain-1', target: 'expert-1' },
      // matched 快捷路径
      { id: 'e7', source: 'intent-router-1', target: 'expert-1', sourceHandle: 'matched' },
      // expert → collaboration-router
      { id: 'e8', source: 'expert-1', target: 'collab-router-1' },
      // 协作路由三路分支
      { id: 'e9', source: 'collab-router-1', target: 'expert-1', sourceHandle: 'continue', data: { label: '继续协作' } },
      { id: 'e10', source: 'collab-router-1', target: 'task-chain-1', sourceHandle: 'nextStep', data: { label: '下一任务' } },
      { id: 'e11', source: 'collab-router-1', target: 'summarizer-1', sourceHandle: 'summarize', data: { label: '生成摘要' } },
      // 摘要 → 结束
      { id: 'e12', source: 'summarizer-1', target: 'end-1' },
    ],
  })
}
