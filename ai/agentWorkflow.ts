/**
 * Agent 工作流编排 - 领域类型（n8n 风格 DAG）
 *
 * 此文件为 barrel re-export，实际实现已按职责拆分到 ./agentWorkflow/ 目录：
 *   - types.ts          所有类型定义
 *   - defaults.ts       默认数据 + 布局算法
 *   - templates.ts      模板元数据
 *   - validation.ts     图校验
 *   - createByTemplate.ts  模板分发器
 *   - templateFactories/   30 个模板工厂函数
 *
 * 保持原有 import 路径不变（backward compatible）。
 */

export * from './agentWorkflow/index.js'
