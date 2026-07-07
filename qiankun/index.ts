/**
 * Qiankun 共享能力模块
 *
 * 提供公共的组合函数和监听函数、注册等
 */

export { useQiankun, initQiankunProps } from './useQiankun'
export { useQiankunShell, initQiankunShellProps, resolveShellEmbedMode } from './useQiankunShell'
export type { ShellEmbedMode } from './useQiankunShell'
export { installSubAppRouteSync } from './syncSubAppRoute'
export { useQiankunEvent, initQiankunLifecycle } from './useQiankunEvent'
export { useMicroApp } from './useMicroApp'
export { createQiankunApp } from './createQiankunApp'
export type { QiankunLifecycle, QiankunProps, QiankunEvent } from './types'
export type { UseMicroAppOptions, UseMicroAppReturn, LoadMicroAppFn } from './useMicroApp'
