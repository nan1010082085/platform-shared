/**
 * 统一控制台日志工具（增强版）
 *
 * 美观的彩色日志输出，支持：
 * - 标签（Tag）：模块标识
 * - 位置（Location）：自动检测调用位置（文件:行号）
 * - 信息（Message）：结构化消息
 * - 颜色（Colors）：层级配色 + 背景色
 * - 图标（Icons）：语义化图标
 * - 数据（Data）：对象/数组美化输出
 *
 * 用法：
 *   import { createLogger } from '@schema-platform/platform-shared/utils/logger'
 *   const log = createLogger('editor', '#0060A2')
 *
 *   log.info('mount done')
 *   // 输出: [✓] editor · src/main.ts:72 · mount done
 *
 *   log.warn('token missing', { userId: 123 })
 *   // 输出: [⚠] editor · src/main.ts:72 · token missing { userId: 123 }
 *
 *   log.error('request failed', error)
 *   // 输出: [✗] editor · src/api.ts:45 · request failed Error: ...
 *
 *   log.lifecycle('beforeMount')
 *   // 输出: [⟳] editor · src/main.ts:15 · beforeMount
 *
 *   log.perf('fetchApps', 120)
 *   // 输出: [⚡] editor · src/api.ts:88 · fetchApps 120ms
 *
 *   log.debug('state changed', store.state)
 *   // 输出: [🔍] editor · src/store.ts:34 · state changed { ... }
 *
 *   log.success('deploy complete')
 *   // 输出: [✅] editor · src/deploy.ts:156 · deploy complete
 *
 *   log.table([{ name: 'foo' }, { name: 'bar' }])
 *   // 输出: 美化的表格
 *
 *   log.group('API Calls', () => { ... })
 *   // 输出: 可折叠的分组
 */

// ── 类型定义 ──

export interface Logger {
  /** 信息日志（蓝色） */
  info: (...args: unknown[]) => void
  /** 警告日志（黄色） */
  warn: (...args: unknown[]) => void
  /** 错误日志（红色） */
  error: (...args: unknown[]) => void
  /** 成功日志（绿色） */
  success: (...args: unknown[]) => void
  /** 生命周期日志（紫色） */
  lifecycle: (...args: unknown[]) => void
  /** 性能/耗时日志（绿色） */
  perf: (label: string, ms: number, ...extra: unknown[]) => void
  /** 调试日志（灰色，生产环境不输出） */
  debug: (...args: unknown[]) => void
  /** 表格日志 */
  table: (data: unknown[], columns?: string[]) => void
  /** 分组日志 */
  group: (label: string, fn: () => void) => void
  /** 折叠分组日志 */
  groupCollapsed: (label: string, fn: () => void) => void
  /** 计时开始 */
  time: (label: string) => void
  /** 计时结束 */
  timeEnd: (label: string) => void
  /** 清空控制台 */
  clear: () => void
}

// ── 样式配置 ──

interface LogStyle {
  icon: string
  css: string
  consoleMethod: 'log' | 'warn' | 'error'
}

const STYLES: Record<string, LogStyle> = {
  info: {
    icon: '✓',
    css: 'color: #409EFF; background: #ECF5FF; border: 1px solid #B3D8FF; border-radius: 3px; padding: 1px 6px; font-weight: 600;',
    consoleMethod: 'log'
  },
  warn: {
    icon: '⚠',
    css: 'color: #E6A23C; background: #FDF6EC; border: 1px solid #F5DAB1; border-radius: 3px; padding: 1px 6px; font-weight: 600;',
    consoleMethod: 'warn'
  },
  error: {
    icon: '✗',
    css: 'color: #F56C6C; background: #FEF0F0; border: 1px solid #FBC4C4; border-radius: 3px; padding: 1px 6px; font-weight: 600;',
    consoleMethod: 'error'
  },
  success: {
    icon: '✅',
    css: 'color: #67C23A; background: #F0F9EB; border: 1px solid #C2E7B0; border-radius: 3px; padding: 1px 6px; font-weight: 600;',
    consoleMethod: 'log'
  },
  lifecycle: {
    icon: '⟳',
    css: 'color: #9B59B6; background: #F5F0FF; border: 1px solid #D7C4F5; border-radius: 3px; padding: 1px 6px; font-weight: 600;',
    consoleMethod: 'log'
  },
  perf: {
    icon: '⚡',
    css: 'color: #00BCD4; background: #E0F7FA; border: 1px solid #80DEEA; border-radius: 3px; padding: 1px 6px; font-weight: 600;',
    consoleMethod: 'log'
  },
  debug: {
    icon: '🔍',
    css: 'color: #909399; background: #F4F4F5; border: 1px solid #D3D4D6; border-radius: 3px; padding: 1px 6px; font-weight: 600;',
    consoleMethod: 'log'
  }
}

// ── 位置检测 ──

interface CallerInfo {
  file: string
  line: number
  column: number
  function: string
}

/**
 * 获取调用者位置信息
 * 通过 Error stack 解析调用栈
 */
function getCallerInfo(depth: number = 3): CallerInfo {
  const error = new Error()
  const stack = error.stack?.split('\n') || []

  // 跳过 Error 和 getCallerInfo 自身，找到真正的调用者
  const callerLine = stack[depth] || ''

  // 解析 Chrome/Firefox 格式: "    at functionName (file:line:column)"
  // 或: "    at file:line:column"
  const match = callerLine.match(/at\s+(?:(\S+)\s+\()?(.+?):(\d+):(\d+)\)?/)

  if (match) {
    const fullPath = match[2] || ''
    // 提取相对路径（去掉 origin 部分）
    let file = fullPath
    try {
      const url = new URL(fullPath)
      // 获取相对于 origin 的路径
      file = url.pathname
      // 去掉常见前缀
      file = file.replace(/^.*?\/(src|node_modules)\//, '$1/')
    } catch {
      // 不是完整 URL，直接使用
    }

    // 简化文件路径，只保留最后两级
    const parts = file.split('/')
    const shortFile = parts.length > 2
      ? parts.slice(-2).join('/')
      : file

    return {
      file: shortFile,
      line: parseInt(match[3], 10),
      column: parseInt(match[4], 10),
      function: match[1] || '<anonymous>'
    }
  }

  return {
    file: '<unknown>',
    line: 0,
    column: 0,
    function: '<unknown>'
  }
}

/**
 * 格式化位置字符串
 */
function formatLocation(info: CallerInfo): string {
  if (info.file === '<unknown>') return ''
  return `${info.file}:${info.line}`
}

// ── 消息格式化 ──

/**
 * 格式化参数为消息字符串
 * 对象/数组会被展开显示
 */
function formatArgs(args: unknown[]): { message: string; data: unknown[] } {
  if (args.length === 0) return { message: '', data: [] }

  const messages: string[] = []
  const data: unknown[] = []

  for (const arg of args) {
    if (typeof arg === 'string') {
      messages.push(arg)
    } else if (arg instanceof Error) {
      messages.push(`${arg.name}: ${arg.message}`)
      data.push(arg.stack)
    } else if (typeof arg === 'object' && arg !== null) {
      data.push(arg)
    } else {
      messages.push(String(arg))
    }
  }

  return {
    message: messages.join(' '),
    data
  }
}

/**
 * 格式化持续时间
 */
function formatDuration(ms: number): string {
  if (ms < 1) return '<1ms'
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

// ── 核心输出 ──

/**
 * 输出格式化的日志
 */
function emitLog(
  level: keyof typeof STYLES,
  tag: string,
  tagColor: string,
  args: unknown[],
  skipCaller: boolean = false
): void {
  const style = STYLES[level]
  const { message, data } = formatArgs(args)

  // 获取调用位置（跳过 emitLog 和调用者）
  const caller = skipCaller ? null : getCallerInfo(4)
  const location = caller ? formatLocation(caller) : ''

  // 构建样式字符串
  const tagStyle = `color: ${tagColor}; background: ${tagColor}22; border: 1px solid ${tagColor}44; border-radius: 3px; padding: 1px 8px; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;`
  const iconStyle = style.css
  const locationStyle = 'color: #8492A6; font-size: 11px; font-style: italic;'
  const messageStyle = level === 'error'
    ? 'color: #F56C6C; font-weight: 500;'
    : level === 'warn'
      ? 'color: #E6A23C; font-weight: 500;'
      : 'color: #303133;'

  // 构建输出格式
  // [✓] TAG · location · message
  const parts: string[] = []
  const styles: string[] = []

  // 图标
  parts.push(`%c${style.icon}`)
  styles.push(iconStyle)

  // 标签
  parts.push(` %c${tag}`)
  styles.push(tagStyle)

  // 位置
  if (location) {
    parts.push(` %c· ${location}`)
    styles.push(locationStyle)
  }

  // 消息
  if (message) {
    parts.push(` %c· ${message}`)
    styles.push(messageStyle)
  }

  // 合并格式字符串
  const formatStr = parts.join('')
  const styleArgs = styles

  // 输出
  const method = console[style.consoleMethod] as (...args: unknown[]) => void
  method(formatStr, ...styleArgs, ...data)
}

// ── 创建 Logger 实例 ──

/**
 * 创建带彩色前缀的 logger
 *
 * @param tag - 模块名（如 'shell'、'editor'、'qiankun'）
 * @param color - 标签颜色（CSS 颜色值，如 '#0060A2'、'#409EFF'）
 * @returns Logger 实例
 *
 * @example
 * const log = createLogger('editor', '#0060A2')
 *
 * log.info('App mounted')        // [✓] EDITOR · src/main.ts:15 · App mounted
 * log.warn('Slow response', { ms: 3500 })
 * log.error('Failed to fetch', new Error('timeout'))
 * log.perf('loadConfig', 85)
 * log.lifecycle('beforeMount')
 */
export function createLogger(tag: string, color: string): Logger {
  const upperTag = tag.toUpperCase()

  // 计时器存储
  const timers = new Map<string, number>()

  return {
    info: (...args: unknown[]) => emitLog('info', upperTag, color, args),
    warn: (...args: unknown[]) => emitLog('warn', upperTag, color, args),
    error: (...args: unknown[]) => emitLog('error', upperTag, color, args),
    success: (...args: unknown[]) => emitLog('success', upperTag, color, args),
    lifecycle: (...args: unknown[]) => emitLog('lifecycle', upperTag, color, args),
    perf: (label: string, ms: number, ...extra: unknown[]) => {
      emitLog('perf', upperTag, color, [`${label} ${formatDuration(ms)}`, ...extra])
    },
    debug: (...args: unknown[]) => {
      if (import.meta.env.DEV) {
        emitLog('debug', upperTag, color, args)
      }
    },

    table: (data: unknown[], columns?: string[]) => {
      console.groupCollapsed(
        `%c📊 ${upperTag} %c· table (${data.length} rows)`,
        `color: ${color}; font-weight: 700;`,
        'color: #8492A6;'
      )
      if (columns) {
        console.table(data, columns)
      } else {
        console.table(data)
      }
      console.groupEnd()
    },

    group: (label: string, fn: () => void) => {
      console.group(
        `%c📂 ${upperTag} %c· ${label}`,
        `color: ${color}; font-weight: 700;`,
        'color: #303133; font-weight: 500;'
      )
      try {
        fn()
      } finally {
        console.groupEnd()
      }
    },

    groupCollapsed: (label: string, fn: () => void) => {
      console.groupCollapsed(
        `%c📁 ${upperTag} %c· ${label}`,
        `color: ${color}; font-weight: 700;`,
        'color: #303133; font-weight: 500;'
      )
      try {
        fn()
      } finally {
        console.groupEnd()
      }
    },

    time: (label: string) => {
      timers.set(label, performance.now())
      emitLog('debug', upperTag, color, [`⏱ Timer started: ${label}`])
    },

    timeEnd: (label: string) => {
      const start = timers.get(label)
      if (start !== undefined) {
        const ms = performance.now() - start
        timers.delete(label)
        emitLog('perf', upperTag, color, [`${label} ${formatDuration(ms)}`])
      } else {
        emitLog('warn', upperTag, color, [`Timer not found: ${label}`])
      }
    },

    clear: () => {
      console.clear()
      emitLog('info', upperTag, color, ['Console cleared'], true)
    }
  }
}

// ── 预定义 logger（常用模块直接导出） ──

/** Shell 宿主日志（蓝色） */
export const shellLog = createLogger('shell', '#409EFF')

/** Qiankun 引擎日志（橙色） */
export const qiankunLog = createLogger('qiankun', '#E6A23C')

/** Editor 子应用日志（深蓝） */
export const editorLog = createLogger('editor', '#0060A2')

/** Flow 子应用日志（青色） */
export const flowLog = createLogger('flow', '#00BCD4')

/** AI 子应用日志（科技蓝） */
export const aiLog = createLogger('ai', '#00D4FF')

/** Server API 日志（翠绿） */
export const serverLog = createLogger('server', '#2ECC71')

/** Socket 通信日志（粉紫） */
export const socketLog = createLogger('socket', '#E91E63')

/** Auth 认证日志（金色） */
export const authLog = createLogger('auth', '#FFD700')

/** UA 用户管理台日志（靛蓝） */
export const uaLog = createLogger('ua', '#5B47E0')

// ── 便捷方法（全局单例） ──

/** 默认 logger（灰色，用于临时/未分类日志） */
export const defaultLog = createLogger('app', '#606266')

/**
 * 快速创建带调用位置的日志
 * 适用于临时调试，不需要创建专用 logger
 *
 * @example
 * import { log } from '@schema-platform/platform-shared/utils/logger'
 * log.info('debug value', someVar)
 */
export const log = defaultLog
