/**
 * 全站分页统一常量
 *
 * 所有列表分页器默认 10 条；可选 10 / 20 / 50。
 */
export const DEFAULT_PAGE_SIZE = 10

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const

export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number]

/** Element Plus pagination 统一 layout */
export const PAGINATION_LAYOUT = 'total, sizes, prev, pager, next'
