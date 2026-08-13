<script setup lang="ts">
/**
 * AppPagination — 全站统一分页器
 *
 * 默认每页 10 条，可选 10/20/50；layout / background 固定一致。
 * total === 0 时不渲染。
 */
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, PAGINATION_LAYOUT } from '../../utils/pagination'
import styles from './AppPagination.module.scss'

const props = withDefaults(
  defineProps<{
    /** 当前页（从 1 开始） */
    currentPage: number
    /** 每页条数 */
    pageSize?: number
    /** 总条数 */
    total: number
    /** 紧凑尺寸（弹窗 / 侧栏等） */
    size?: 'default' | 'small'
  }>(),
  {
    pageSize: DEFAULT_PAGE_SIZE,
    size: 'default',
  },
)

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:pageSize': [size: number]
  /** 兼容非 v-model 调用方 */
  currentChange: [page: number]
  sizeChange: [size: number]
}>()

/**
 * @param page - 新页码
 */
function onCurrentChange(page: number) {
  emit('update:currentPage', page)
  emit('currentChange', page)
}

/**
 * @param size - 新每页条数
 */
function onSizeChange(size: number) {
  emit('update:pageSize', size)
  emit('sizeChange', size)
}
</script>

<template>
  <div v-if="props.total > 0" :class="styles.pagination" data-testid="app-pagination">
    <el-pagination
      :current-page="props.currentPage"
      :page-size="props.pageSize"
      :page-sizes="[...PAGE_SIZE_OPTIONS]"
      :total="props.total"
      :layout="PAGINATION_LAYOUT"
      :size="props.size"
      background
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
    />
  </div>
</template>
