/**
 * MCP 工具名权威定义 — 内部 Chat 与外部 MCP 客户端共用。
 *
 * 命名规范：{domain}__{action}，如 schema__search、flow__validate。
 * LangGraph 专有工具（HITL / 图路由）不带前缀：update_schema、generate_schema 等。
 */

// ── MCP Schema ──
export const SCHEMA_SEARCH = 'schema__search'
export const SCHEMA_GET_DETAIL = 'schema__get_detail'
export const SCHEMA_VALIDATE = 'schema__validate'
export const SCHEMA_VALIDATE_WIDGETS = 'schema__validate_widgets'
export const SCHEMA_SEARCH_PUBLISHED = 'schema__search_published'
export const SCHEMA_FUZZY_SEARCH = 'schema__fuzzy_search'
export const SCHEMA_FIND_FLOW_REFERENCES = 'schema__find_flow_references'

// ── MCP Flow ──
export const FLOW_SEARCH = 'flow__search'
export const FLOW_GET_DETAIL = 'flow__get_detail'
export const FLOW_VALIDATE = 'flow__validate'
export const FLOW_SEARCH_USERS = 'flow__search_users'
export const FLOW_GET_NODE_SCHEMA = 'flow__get_node_schema'

// ── MCP Widget ──
export const WIDGET_QUERY = 'widget__query'
export const WIDGET_VALIDATE = 'widget__validate'

// ── MCP RAG ──
export const RAG_SEARCH = 'rag__search'

// ── MCP Industry ──
export const INDUSTRY_SEARCH_TEMPLATES = 'industry__search_templates'
export const INDUSTRY_VALIDATE_FORM = 'industry__validate_form'

// ── LangGraph 专有 ──
export const UPDATE_SCHEMA = 'update_schema'
export const GENERATE_SCHEMA = 'generate_schema'
export const UPDATE_FLOW = 'update_flow'
export const SAVE_AND_BIND_SCHEMA = 'save_and_bind_schema'
export const BIND_SCHEMA_TO_FLOW_NODE = 'bind_schema_to_flow_node'
export const REQUEST_COLLABORATION = 'request_collaboration'
export const RAG_INDEX = 'rag_index'

export function normalizeToolName(name: string): string {
  return name
}

/** 判断是否为 Schema Widget 校验类工具 */
export function isSchemaWidgetValidateTool(name: string): boolean {
  return name === SCHEMA_VALIDATE_WIDGETS || name === UPDATE_SCHEMA
}

/** 判断是否为 Flow 写入/校验类工具 */
export function isFlowWriteOrValidateTool(name: string): boolean {
  return name === FLOW_VALIDATE || name === UPDATE_FLOW
}

export const TOOL_DISPLAY_LABELS: Record<string, string> = {
  [SCHEMA_SEARCH]: '搜索表单',
  [SCHEMA_GET_DETAIL]: '获取表单详情',
  [SCHEMA_VALIDATE]: '校验 Schema',
  [SCHEMA_VALIDATE_WIDGETS]: '校验 Schema',
  [SCHEMA_SEARCH_PUBLISHED]: '搜索已发布表单',
  [SCHEMA_FUZZY_SEARCH]: '模糊搜索表单',
  [SCHEMA_FIND_FLOW_REFERENCES]: '查找流程引用',
  [FLOW_SEARCH]: '搜索流程',
  [FLOW_GET_DETAIL]: '获取流程详情',
  [FLOW_VALIDATE]: '校验流程',
  [FLOW_SEARCH_USERS]: '搜索用户',
  [FLOW_GET_NODE_SCHEMA]: '获取流程节点表单',
  [WIDGET_QUERY]: '查询组件',
  [WIDGET_VALIDATE]: '校验组件 Schema',
  [RAG_SEARCH]: '智能匹配',
  [INDUSTRY_SEARCH_TEMPLATES]: '搜索行业模板',
  [INDUSTRY_VALIDATE_FORM]: '校验行业表单',
  [UPDATE_SCHEMA]: '更新表单',
  [GENERATE_SCHEMA]: '生成表单',
  [UPDATE_FLOW]: '更新流程',
  [SAVE_AND_BIND_SCHEMA]: '保存并绑定表单',
  [BIND_SCHEMA_TO_FLOW_NODE]: '绑定表单到流程节点',
  [REQUEST_COLLABORATION]: '请求协作',
  [RAG_INDEX]: 'RAG 索引',
  http_request: 'HTTP 请求',
}

export function getToolDisplayLabel(name: string): string {
  return TOOL_DISPLAY_LABELS[name] ?? name
}

// ── Prompt 片段（工具说明注入 System Prompt）──

export const EDITOR_MCP_TOOLS_PROMPT = `可用 MCP 工具（Schema 域）：
- ${SCHEMA_SEARCH}: 按关键词搜索表单
- ${SCHEMA_GET_DETAIL}: 获取表单详情
- ${SCHEMA_VALIDATE_WIDGETS}: 校验 Widget Schema
- ${SCHEMA_SEARCH_PUBLISHED}: 搜索已发布表单
- ${SCHEMA_FUZZY_SEARCH}: 模糊搜索表单
- ${SCHEMA_FIND_FLOW_REFERENCES}: 查找流程引用
专有：${UPDATE_SCHEMA}、${GENERATE_SCHEMA}`

export const FLOW_MCP_TOOLS_PROMPT = `可用 MCP 工具（Flow 域）：
- ${FLOW_SEARCH}: 搜索流程
- ${FLOW_GET_DETAIL}: 获取流程详情
- ${FLOW_VALIDATE}: 校验 BPMN
- ${FLOW_SEARCH_USERS}: 搜索用户
- ${FLOW_GET_NODE_SCHEMA}: 获取节点表单
专有：${UPDATE_FLOW}、${SAVE_AND_BIND_SCHEMA}、${BIND_SCHEMA_TO_FLOW_NODE}`

export const PAGE_MCP_TOOLS_PROMPT = `可用 MCP 工具（Widget / Industry）：
- ${WIDGET_QUERY}: 查询组件
- ${WIDGET_VALIDATE}: 校验组件
- ${INDUSTRY_SEARCH_TEMPLATES}: 搜索行业模板
- ${INDUSTRY_VALIDATE_FORM}: 校验行业表单`

export const REQUIREMENT_ANALYZER_TOOLS_PROMPT = `需求分析可用工具：
- ${SCHEMA_SEARCH}、${FLOW_SEARCH}、${RAG_SEARCH}`
