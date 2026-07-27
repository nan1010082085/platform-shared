/**
 * Agent 工作流 - 默认数据与布局算法
 */

import type {
  AgentNodeType,
  AgentWorkflowGraph,
  AgentWorkflowNodeData,
} from './types.js'
export function createDefaultAgentWorkflowGraph(): AgentWorkflowGraph {
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
        id: 'llm-1',
        type: 'llm',
        position: { x: 320, y: 200 },
        data: { label: 'LLM', prompt: '{{$input.message}}', model: 'default' },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 560, y: 200 },
        data: { label: '结束' },
      },
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'llm-1' },
      { id: 'e2', source: 'llm-1', target: 'end-1' },
    ],
  })
}

/** 按节点类型生成默认 NodeData（设计器拖入节点时使用） */
export function createDefaultNodeData(type: AgentNodeType): AgentWorkflowNodeData {
  const base: AgentWorkflowNodeData = { label: type }
  switch (type) {
    case 'intent-router':
      return {
        ...base,
        label: '意图路由',
        routingMode: 'auto',
        enableMultiIntentChain: false,
        fallbackExpertId: '',
      } as AgentWorkflowNodeData
    case 'summarizer':
      return {
        ...base,
        label: '摘要',
        summarySource: 'taskChain',
        customPrompt: '',
        stream: false,
        model: 'default',
      } as AgentWorkflowNodeData
    case 'requirement-analyzer':
      return {
        ...base,
        label: '需求分析',
        enableRag: true,
        enableTools: true,
        completenessThreshold: 80,
        model: 'default',
      } as AgentWorkflowNodeData
    case 'task-planner':
      return {
        ...base,
        label: '任务规划',
        inputSource: 'message',
        maxSteps: 8,
        strategy: 'sequential',
        model: 'default',
      } as AgentWorkflowNodeData
    case 'task-chain':
      return {
        ...base,
        label: '任务链',
        chainSource: 'upstream',
        staticChain: [],
        onStepOutput: '',
      } as AgentWorkflowNodeData
    case 'collaboration-router':
      return {
        ...base,
        label: '协作路由',
        detectCollaborationTool: true,
        maxCollaborationRounds: 3,
      } as AgentWorkflowNodeData
    case 'audio-transcribe':
      return {
        ...base,
        label: '音频转录',
        documentSource: 'stream',
        streamField: 'file',
        language: 'zh',
      } as AgentWorkflowNodeData
    case 'video-analyze':
      return {
        ...base,
        label: '视频分析',
        documentSource: 'stream',
        streamField: 'file',
        visionPrompt: '',
        maxFrames: 10,
      } as AgentWorkflowNodeData
    case 'image-generate':
      return {
        ...base,
        label: '图片生成',
        imagePrompt: '',
        imageModel: '',
        imageSize: '1024x1024',
        imageStyle: 'vivid',
        imageQuality: 'standard',
        imageCount: 1,
      } as AgentWorkflowNodeData
    case 'video-generate':
      return {
        ...base,
        label: '视频生成',
        videoPrompt: '',
        videoModel: '',
        duration: 8,
        resolution: '720p',
        pollIntervalMs: 5000,
        pollTimeoutMs: 300000,
      } as AgentWorkflowNodeData
    case 'agent-loop':
      return {
        ...base,
        label: '智能体循环',
        model: 'default',
        agentLoopTools: [],
        agentLoopMaxIterations: 8,
        agentLoopSystemPrompt: '你是一个自主智能体，根据用户请求调用可用工具完成任务。每次思考后选择一个工具调用，获得结果后继续，直到任务完成时直接给出最终回答（不要调用工具）。',
        agentLoopInputSource: 'message',
        agentLoopInputTemplate: '',
      } as AgentWorkflowNodeData
    case 'agent-team':
      return {
        ...base,
        label: 'Agent 团队',
        agentTeamMembers: [
          { name: '产品', persona: '产品经理，负责需求分析和方案设计', tools: [] },
          { name: '开发', persona: '开发工程师，负责技术实现和代码编写', tools: [] },
        ],
        agentTeamMode: 'sequential',
        agentTeamMaxRounds: 5,
        agentTeamModel: 'default',
        agentTeamSystemPrompt: '',
        agentLoopMaxToolInvocations: 50,
      } as AgentWorkflowNodeData
    case 'approval-analyze':
      return {
        ...base,
        label: '审批建议',
        approvalSubmissionSource: 'input',
        approvalModel: 'default',
      } as AgentWorkflowNodeData
    case 'flow-interact':
      return {
        ...base,
        label: '流程交互',
        flowInteractAction: 'query',
      } as AgentWorkflowNodeData
    case 'compliance-check':
      return {
        ...base,
        label: '合规检查',
        complianceIndustry: 'general',
        complianceRules: [],
      } as AgentWorkflowNodeData
    case 'module-assemble':
      return {
        ...base,
        label: '模块组装',
        moduleType: 'custom',
      } as AgentWorkflowNodeData
    case 'form-query':
      return {
        ...base,
        label: '表单查询',
        formQueryLimit: 10,
      } as AgentWorkflowNodeData
    case 'anomaly-detect':
      return {
        ...base,
        label: '异常检测',
        anomalyDimensions: ['amount', 'frequency'],
      } as AgentWorkflowNodeData
    case 'chart-generate':
      return {
        ...base,
        label: '图表生成',
        chartType: 'auto',
      } as AgentWorkflowNodeData
    case 'code-execute':
      return {
        ...base,
        label: '代码执行',
        codeLanguage: 'javascript',
        codeScript: '// 可用变量：$input（工作流输入）、$node（上游节点输出）\n// 返回值作为节点输出\nreturn { result: $input.message }',
      } as AgentWorkflowNodeData
    case 'variable-set':
      return {
        ...base,
        label: '变量赋值',
        variableName: 'myVar',
        variableValue: '{{$input.message}}',
        variableMode: 'set',
      } as AgentWorkflowNodeData
    case 'switch':
      return {
        ...base,
        label: '多路分支',
        switchBranches: [
          { label: '分支A', expression: 'true' },
          { label: '分支B', expression: 'false' },
        ],
      } as AgentWorkflowNodeData
    case 'memory-recall':
      return {
        ...base,
        label: '长程记忆检索',
        memoryRecallQuery: '{{$input.message}}',
        memoryRecallLimit: 5,
        memoryRecallNamespace: 'all',
        memoryRecallUserIdSource: 'auto',
      } as AgentWorkflowNodeData
    case 'memory-write':
      return {
        ...base,
        label: '长程记忆写入',
        memoryWriteContent: '{{$input.message}}',
        memoryWriteNamespace: 'fact',
        memoryWriteImportance: 0.5,
        memoryWriteUserIdSource: 'auto',
      } as AgentWorkflowNodeData
    case 'memory-extract':
      return {
        ...base,
        label: '长程记忆提取',
        memoryExtractSource: 'lastOutput',
        memoryExtractModel: 'default',
        memoryExtractNamespace: 'fact',
      } as AgentWorkflowNodeData
    case 'handoff':
      return {
        ...base,
        label: '会话交接',
        handoffTargetWorkflowId: '',
        handoffPassHistory: true,
        handoffInputTemplate: '{{$input.message}}',
      } as AgentWorkflowNodeData
    default:
      return base
  }
}

const AGENT_NODE_LAYOUT_STEP_X = 340
const AGENT_NODE_LAYOUT_STEP_Y = 180
const AGENT_NODE_LAYOUT_BASE_X = 80
const AGENT_NODE_LAYOUT_BASE_Y = 200

/** 按 DAG 层级自动拉开节点间距，避免宽节点卡片重叠 */
export function layoutAgentWorkflowGraph(graph: AgentWorkflowGraph): AgentWorkflowGraph {
  if (!graph.nodes.length) return graph

  const levels = new Map<string, number>()
  for (const node of graph.nodes) levels.set(node.id, 0)
  if (graph.entryNodeId && levels.has(graph.entryNodeId)) {
    levels.set(graph.entryNodeId, 0)
  }

  let changed = true
  let guard = 0
  while (changed && guard < graph.nodes.length + graph.edges.length + 4) {
    changed = false
    guard += 1
    for (const edge of graph.edges) {
      const next = (levels.get(edge.source) ?? 0) + 1
      if (next > (levels.get(edge.target) ?? 0)) {
        levels.set(edge.target, next)
        changed = true
      }
    }
  }

  const byLevel = new Map<number, string[]>()
  for (const node of graph.nodes) {
    const level = levels.get(node.id) ?? 0
    const bucket = byLevel.get(level) ?? []
    bucket.push(node.id)
    byLevel.set(level, bucket)
  }

  for (const ids of byLevel.values()) {
    ids.sort((a, b) => {
      const ay = graph.nodes.find((n) => n.id === a)?.position.y ?? 0
      const by = graph.nodes.find((n) => n.id === b)?.position.y ?? 0
      return ay - by || a.localeCompare(b)
    })
  }

  return {
    ...graph,
    nodes: graph.nodes.map((node) => {
      const level = levels.get(node.id) ?? 0
      const peers = byLevel.get(level) ?? [node.id]
      const peerIndex = peers.indexOf(node.id)
      const peerCount = peers.length
      const yOffset = (peerIndex - (peerCount - 1) / 2) * AGENT_NODE_LAYOUT_STEP_Y
      return {
        ...node,
        position: {
          x: AGENT_NODE_LAYOUT_BASE_X + level * AGENT_NODE_LAYOUT_STEP_X,
          y: AGENT_NODE_LAYOUT_BASE_Y + yOffset,
        },
      }
    }),
  }
}
