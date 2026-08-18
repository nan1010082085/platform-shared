# 🎨 统一控制台日志工具

美观的彩色日志输出，支持标签、位置、信息、颜色、图标等特性。

## 快速开始

```typescript
import { createLogger, editorLog, log } from '@schema-platform/platform-shared/utils/logger'

// 创建自定义 logger
const myLog = createLogger('myModule', '#FF6B6B')

// 使用预定义 logger
import { editorLog, flowLog, aiLog } from '@schema-platform/platform-shared/utils/logger'

// 使用全局默认 logger
import { log } from '@schema-platform/platform-shared/utils/logger'
```

## 输出格式

所有日志输出格式为：
```
[图标] TAG · 文件:行号 · 消息内容
```

示例输出：
```
[✓] EDITOR · src/main.ts:72 · App mounted
[⚠] SHELL · src/auth.ts:45 · Token will expire soon { expiresIn: 300 }
[✗] FLOW · src/api.ts:88 · Request failed Error: timeout
[✅] AI · src/deploy.ts:156 · Deploy complete
[⟳] EDITOR · src/main.ts:15 · beforeMount
[⚡] SHELL · src/api.ts:120 · fetchApps 85ms
[🔍] FLOW · src/store.ts:34 · State changed { ... }
```

## API

### 创建 Logger

```typescript
const log = createLogger(tag: string, color: string): Logger
```

- `tag` - 模块名称（自动转为大写）
- `color` - CSS 颜色值（如 '#0060A2'、'rgb(255,0,0)'）

### 日志方法

#### `log.info(...args)`
信息日志（蓝色 ✓ 图标）
```typescript
log.info('User logged in', { userId: 123 })
// [✓] AUTH · src/login.ts:25 · User logged in { userId: 123 }
```

#### `log.warn(...args)`
警告日志（黄色 ⚠ 图标）
```typescript
log.warn('Token will expire', { expiresIn: 300 })
// [⚠] AUTH · src/token.ts:45 · Token will expire { expiresIn: 300 }
```

#### `log.error(...args)`
错误日志（红色 ✗ 图标）
```typescript
log.error('Request failed', new Error('timeout'))
// [✗] API · src/client.ts:88 · Request failed Error: timeout
//     at fetch (src/client.ts:85:12)
```

#### `log.success(...args)`
成功日志（绿色 ✅ 图标）
```typescript
log.success('Deploy complete')
// [✅] DEPLOY · src/deploy.ts:156 · Deploy complete
```

#### `log.lifecycle(...args)`
生命周期日志（紫色 ⟳ 图标）
```typescript
log.lifecycle('beforeMount')
// [⟳] EDITOR · src/main.ts:15 · beforeMount
```

#### `log.perf(label, ms, ...extra)`
性能日志（青色 ⚡ 图标）
```typescript
log.perf('fetchApps', 120)
// [⚡] API · src/apps.ts:88 · fetchApps 120ms

log.perf('render', 45, { nodes: 150 })
// [⚡] EDITOR · src/render.ts:120 · render 45ms { nodes: 150 }
```

#### `log.debug(...args)`
调试日志（灰色 🔍 图标，仅开发环境输出）
```typescript
log.debug('State changed', store.state)
// [🔍] STORE · src/index.ts:34 · State changed { ... }
```

### 高级方法

#### `log.table(data, columns?)`
表格日志
``	ypescript
log.table([
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
])
// 📊 TABLE · table (2 rows)
// ┌─────────┬──────┬─────┐
// │ (index) │ name │ age │
// ├─────────┼──────┼─────┤
// │    0    │'Alice'│ 25  │
// │    1    │ 'Bob' │ 30  │
// └─────────┴──────┴─────┘
```

#### `log.group(label, fn)`
分组日志
```typescript
log.group('API Calls', () => {
  log.info('Fetching users...')
  log.info('Fetching posts...')
})
// 📂 API · API Calls
//   [✓] API · src/users.ts:15 · Fetching users...
//   [✓] API · src/posts.ts:20 · Fetching posts...
```

#### `log.groupCollapsed(label, fn)`
折叠分组日志

#### `log.time(label)` / `log.timeEnd(label)`
计时器
```typescript
log.time('render')
// ... 执行操作 ...
log.timeEnd('render')
// [⚡] EDITOR · render 45ms
```

#### `log.clear()`
清空控制台

## 预定义 Logger

| Logger | 标签 | 颜色 | 用途 |
|--------|------|------|------|
| `shellLog` | SHELL | 蓝色 #409EFF | Shell 宿主 |
| `qiankunLog` | QIANKUN | 橙色 #E6A23C | Qiankun 引擎 |
| `editorLog` | EDITOR | 深蓝 #0060A2 | Editor 子应用 |
| `flowLog` | FLOW | 青色 #00BCD4 | Flow 子应用 |
| `aiLog` | AI | 科技蓝 #00D4FF | AI 子应用 |
| `uaLog` | UA | 靛蓝 #5B47E0 | UA 用户管理台 |
| `serverLog` | SERVER | 翠绿 #2ECC71 | Server API |
| `socketLog` | SOCKET | 粉紫 #E91E63 | Socket 通信 |
| `authLog` | AUTH | 金色 #FFD700 | Auth 认证 |
| `defaultLog` / `log` | APP | 灰色 #606266 | 默认/临时日志 |

## 最佳实践

### 1. 使用预定义 Logger
```typescript
import { editorLog } from '@schema-platform/platform-shared/utils/logger'

// ✅ 推荐
editorLog.info('Component mounted')

// ❌ 避免
console.log('[Editor] Component mounted')
```

### 2. 包含上下文数据
```typescript
// ✅ 推荐
log.info('User action', { action: 'click', target: 'button' })

// ❌ 避免
log.info('User action: click, target: button')
```

### 3. 使用正确的日志级别
``	ypescript
log.info('Normal operation')      // 一般信息
log.warn('Potential issue')       // 警告
log.error('Operation failed')     // 错误
log.success('Operation complete') // 成功
log.lifecycle('mount')            // 生命周期
log.perf('fetch', 100)           // 性能
log.debug('State', state)        // 调试（仅开发环境）
```

### 4. 性能计时
```typescript
log.time('heavyOperation')
await heavyOperation()
log.timeEnd('heavyOperation')
// [⚡] MODULE · heavyOperation 1.23s
```

## 迁移指南

从旧版 logger 迁移：

```typescript
// 旧版
import { createLogger } from '@schema-platform/platform-shared/utils/logger'
const log = createLogger('editor', '#0060A2')
log.info('mount done')  // [editor] mount done

// 新版（API 兼容，输出更美观）
import { createLogger } from '@schema-platform/platform-shared/utils/logger'
const log = createLogger('editor', '#0060A2')
log.info('mount done')  // [✓] EDITOR · src/main.ts:72 · mount done
```

新版完全兼容旧版 API，无需修改代码即可获得更美观的输出。

## 浏览器兼容性

- Chrome 49+
- Firefox 45+
- Safari 10+
- Edge 14+

使用 CSS 样式化输出，需要浏览器支持 `console.log` 的 CSS 格式化参数。
