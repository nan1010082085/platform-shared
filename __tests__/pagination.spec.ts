/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useClientPagination } from '../utils/useClientPagination'
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, PAGINATION_LAYOUT } from '../utils/pagination'

describe('pagination constants', () => {
  it('defaults to 10 with unified sizes/layout', () => {
    expect(DEFAULT_PAGE_SIZE).toBe(10)
    expect([...PAGE_SIZE_OPTIONS]).toEqual([10, 20, 50])
    expect(PAGINATION_LAYOUT).toBe('total, sizes, prev, pager, next')
  })
})

describe('useClientPagination', () => {
  it('slices with default page size 10 and resets on dependency change', async () => {
    const source = ref(Array.from({ length: 25 }, (_, i) => i + 1))
    const filter = ref('a')
    const { currentPage, pageSize, pagedItems, total } = useClientPagination(source, {
      resetOn: [filter],
    })
    expect(pageSize.value).toBe(10)
    expect(total.value).toBe(25)
    expect(pagedItems.value).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    currentPage.value = 3
    expect(pagedItems.value).toEqual([21, 22, 23, 24, 25])
    filter.value = 'b'
    await Promise.resolve()
    expect(currentPage.value).toBe(1)
  })
})
