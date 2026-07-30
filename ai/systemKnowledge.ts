/**
 * 系统知识 — 事件系统、联动系统、变量系统、数据源配置
 *
 * 这些是稳定的领域知识，不随 widget 扩展而变化。
 * 从 editor/web/src/widgets/base/types.ts 提取，保持单一数据源。
 */

// ────────────────────────────────────────────
// 事件系统（16 种动作类型）
// ────────────────────────────────────────────

export const EVENT_ACTION_TYPES = [
  'show', 'hide', 'open-dialog', 'close-dialog', 'switch-tab',
  'set-value', 'submit', 'reset', 'emit', 'set-variable',
  'trigger-event', 'post-message', 'close-tab', 'copy', 'refresh',
  'api', 'navigate',
] as const

export const EVENT_ACTION_DESCRIPTIONS: Record<string, string> = {
  show: '显示目标组件',
  hide: '隐藏目标组件',
  'open-dialog': '打开弹窗',
  'close-dialog': '关闭弹窗',
  'switch-tab': '切换标签页',
  'set-value': '设置组件值',
  submit: '提交表单',
  reset: '重置表单',
  emit: '触发自定义事件',
  'set-variable': '设置变量',
  'trigger-event': '触发目标组件事件',
  'post-message': '发送 postMessage',
  'close-tab': '关闭浏览器页签',
  copy: '复制文本到剪贴板',
  refresh: '刷新数据',
  api: '调用后端 API',
  navigate: '路由跳转',
}

export const EVENT_ACTION_FIELDS: Record<string, Record<string, string>> = {
  show: { target: '目标组件 ID' },
  hide: { target: '目标组件 ID' },
  'open-dialog': { target: '弹窗组件 ID' },
  'close-dialog': {},
  'switch-tab': { target: '标签页组件 ID', value: '标签页 key' },
  'set-value': { target: '目标组件 ID', value: '要设置的值' },
  submit: {},
  reset: {},
  emit: { value: '事件 payload' },
  'set-variable': { variable: '变量名', value: '变量值' },
  'trigger-event': { target: '目标组件 ID', event: '事件名' },
  'post-message': { message: '消息内容（JSON）' },
  'close-tab': {},
  copy: { text: '要复制的文本（支持 formData.xxx）' },
  refresh: { target: '目标组件 ID' },
  api: { apiUrl: 'API 地址', apiMethod: '请求方法', apiParams: '请求参数' },
  navigate: { navigatePath: '路由路径', navigateQuery: '查询参数' },
}

/** 事件触发器 */
export const EVENT_TRIGGERS = [
  'click', 'change', 'focus', 'blur', 'submit', 'close', 'open',
  'confirm', 'cancel', 'refresh', 'api-success', 'api-error', 'mounted',
] as const

// ────────────────────────────────────────────
// 联动系统（6 种类型）
// ────────────────────────────────────────────

export const LINKAGE_TYPES = ['visible', 'disabled', 'required', 'options', 'set-value', 'reset-fields'] as const

export const LINKAGE_DESCRIPTIONS: Record<string, string> = {
  visible: '条件显隐 — 根据表达式控制组件是否可见',
  disabled: '条件禁用 — 根据表达式控制组件是否禁用',
  required: '条件必填 — 根据表达式控制组件是否必填',
  options: '动态选项 — 条件满足时加载不同的选项数据（静态或 API）',
  'set-value': '条件设值 — 条件满足时自动设置字段值',
  'reset-fields': '条件重置 — 条件满足时重置指定字段',
}

// ────────────────────────────────────────────
// 变量系统
// ────────────────────────────────────────────

export const VARIABLE_TYPES = ['string', 'number', 'boolean', 'object', 'array'] as const

export const VARIABLE_SCOPE_DESCRIPTIONS = {
  widget: '组件级变量，作用域限于该组件内部',
  board: '页面级全局变量，所有组件可访问',
} as const

// ────────────────────────────────────────────
// 数据源配置（SchemaApiConfig）
// ────────────────────────────────────────────

export const API_CONFIG_FIELDS = {
  url: 'API 地址（必填）',
  method: '请求方法：get / post',
  params: 'URL 查询参数（JSON 对象）',
  headers: '自定义请求头',
  body: 'POST 请求体',
  timeout: '超时时间（毫秒），默认 5000',
  dataPath: '数据路径（如 result.records），自动检测 data > list > rows > items',
  labelKey: '选项标签字段名，默认 label',
  valueKey: '选项值字段名，默认 value',
  childrenKey: '树形数据子节点字段名',
  ttl: '缓存 TTL（毫秒），0 = 永不过期',
  immediate: '是否挂载时立即加载，默认 true',
  dictCode: '字典编码（优先于 url，从全局字典查找）',
} as const

// ────────────────────────────────────────────
// 输出格式标签
// ────────────────────────────────────────────

export const OUTPUT_TAGS = {
  think: '分析用户需求的过程（必填，3-5 行）',
  answer: '简洁中文说明生成了什么（必填，不含 JSON）',
  tip: '使用建议或优化提示（可选，1-2 条）',
  schema: '生成的 JSON 数据（必填，editor 用 schema_update，flow 用 flow_update）',
} as const

// ────────────────────────────────────────────
// 垂直行业表单规范（行业关键字段，供 AI 生成行业表单参考）
// ────────────────────────────────────────────

export const INDUSTRY_FORM_STANDARDS: Record<string, { fields: string[]; rules: string[] }> = {
  medical: {
    fields: ['patientName', 'gender', 'age', 'chiefComplaint', 'diagnosis', 'medications', 'allergies'],
    rules: ['病历表单必含主诉与诊断', '过敏史字段必填', '用药字段含用法用量'],
  },
  finance: {
    fields: ['applicantName', 'idNumber', 'loanAmount', 'loanTerm', 'income', 'creditScore', 'collateral'],
    rules: ['贷款申请必含金额/期限/收入', '身份证号字段加格式校验', '金额字段为 number'],
  },
  education: {
    fields: ['studentName', 'studentId', 'grade', 'subject', 'score', 'teacherComment'],
    rules: ['报名表单含年级/班级', '成绩字段为 number', '评语为 textarea'],
  },
  government: {
    fields: ['petitionerName', 'contact', 'category', 'urgency', 'content', 'department'],
    rules: ['诉求表单含类别/紧急度', '联系方式必填', '诉求内容为 textarea'],
  },
  retail: {
    fields: ['productName', 'sku', 'price', 'stock', 'category', 'supplier'],
    rules: ['商品表单含 SKU/价格/库存', '价格与库存为 number'],
  },
  hr: {
    fields: ['employeeName', 'employeeId', 'department', 'position', 'leaveType', 'startDate', 'endDate', 'reason'],
    rules: ['请假表单含起止日期与类型', '日期用 date', '事由为 textarea'],
  },
}
