<script setup lang="ts">
/**
 * AppUserPanel — 用户入口面板
 *
 * 默认只显示用户名（带头像首字）；hover / focus 弹出详情与退出。
 * 退出由调用方处理（清 token、跳登录）。
 */
import { computed } from 'vue'
import type { AuthUser } from '../../utils/authTypes'
import AppIcon from './AppIcon.vue'
import styles from './AppUserPanel.module.scss'

const props = withDefaults(
  defineProps<{
    /** 当前登录用户；为空时仍渲染占位触发器 */
    user: AuthUser | null
    /**
     * 面板弹出方向
     * - 顶栏：bottom / bottom-end
     * - 侧栏底部：top / top-start
     */
    placement?: 'bottom' | 'bottom-end' | 'top' | 'top-start'
    /** 侧栏底部时铺满宽度 */
    block?: boolean
    /** 退出按钮文案 */
    logoutLabel?: string
  }>(),
  {
    placement: 'bottom-end',
    block: false,
    logoutLabel: '退出',
  },
)

const emit = defineEmits<{
  logout: []
}>()

const displayName = computed(
  () => props.user?.displayName || props.user?.username || '用户',
)

const initial = computed(() => {
  const name = displayName.value.trim()
  return name ? name.charAt(0).toUpperCase() : '?'
})

const detailRows = computed(() => {
  const u = props.user
  if (!u) return [] as Array<{ label: string; value: string }>

  const rows: Array<{ label: string; value: string }> = [
    { label: '用户名', value: u.username },
  ]
  if (u.email) rows.push({ label: '邮箱', value: u.email })
  if (u.phone) rows.push({ label: '手机', value: u.phone })
  if (u.tenantId) rows.push({ label: '租户', value: u.tenantId })
  return rows
})

/** 触发退出（由父级清会话并跳转） */
function handleLogout() {
  emit('logout')
}
</script>

<template>
  <div :class="[styles.root, block && styles.rootBlock]">
    <el-popover
      :placement="placement"
      :trigger="['hover', 'focus']"
      :show-arrow="false"
      :offset="8"
      :show-after="80"
      :hide-after="160"
      :width="260"
      :teleported="true"
    >
      <template #reference>
        <button
          type="button"
          :class="[styles.trigger, block && styles.triggerBlock]"
          :aria-label="displayName"
        >
          <span :class="styles.avatar" aria-hidden="true">{{ initial }}</span>
          <span :class="styles.name">{{ displayName }}</span>
        </button>
      </template>

      <div :class="styles.panel">
        <div :class="styles.header">
          <span :class="styles.headerAvatar" aria-hidden="true">{{ initial }}</span>
          <div :class="styles.headerText">
            <div :class="styles.displayName">{{ displayName }}</div>
            <div v-if="user?.username" :class="styles.username">@{{ user.username }}</div>
          </div>
        </div>

        <dl v-if="detailRows.length > 0" :class="styles.rows">
          <div v-for="row in detailRows" :key="row.label" :class="styles.row">
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </div>
        </dl>

        <div :class="styles.divider" />

        <button type="button" :class="styles.logoutBtn" @click="handleLogout">
          <AppIcon name="switch-button" :size="14" />
          <span>{{ logoutLabel }}</span>
        </button>
      </div>
    </el-popover>
  </div>
</template>
