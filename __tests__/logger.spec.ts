/**
 * Logger 测试文件
 * 运行: cd shared/platform-shared && npx vitest run __tests__/logger.spec.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createLogger, editorLog, log } from '../utils/logger'

describe('Logger', () => {
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>
    warn: ReturnType<typeof vi.spyOn>
    error: ReturnType<typeof vi.spyOn>
  }

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {})
    }
  })

  describe('createLogger', () => {
    it('should create logger with correct methods', () => {
      const log = createLogger('test', '#FF0000')
      expect(log.info).toBeInstanceOf(Function)
      expect(log.warn).toBeInstanceOf(Function)
      expect(log.error).toBeInstanceOf(Function)
      expect(log.success).toBeInstanceOf(Function)
      expect(log.lifecycle).toBeInstanceOf(Function)
      expect(log.perf).toBeInstanceOf(Function)
      expect(log.debug).toBeInstanceOf(Function)
      expect(log.table).toBeInstanceOf(Function)
      expect(log.group).toBeInstanceOf(Function)
      expect(log.groupCollapsed).toBeInstanceOf(Function)
      expect(log.time).toBeInstanceOf(Function)
      expect(log.timeEnd).toBeInstanceOf(Function)
      expect(log.clear).toBeInstanceOf(Function)
    })

    it('should output info log with tag', () => {
      const log = createLogger('TEST', '#FF0000')
      log.info('test message')
      expect(consoleSpy.log).toHaveBeenCalled()
      const args = consoleSpy.log.mock.calls[0]
      expect(args[0]).toContain('TEST')
    })

    it('should output warn log with warning style', () => {
      const log = createLogger('TEST', '#FF0000')
      log.warn('warning message')
      expect(consoleSpy.warn).toHaveBeenCalled()
    })

    it('should output error log with error style', () => {
      const log = createLogger('TEST', '#FF0000')
      log.error('error message')
      expect(consoleSpy.error).toHaveBeenCalled()
    })

    it('should handle multiple arguments', () => {
      const log = createLogger('TEST', '#FF0000')
      log.info('message', { key: 'value' }, 123)
      expect(consoleSpy.log).toHaveBeenCalled()
    })

    it('should handle Error objects', () => {
      const log = createLogger('TEST', '#FF0000')
      const error = new Error('test error')
      log.error('Failed', error)
      expect(consoleSpy.error).toHaveBeenCalled()
    })
  })

  describe('predefined loggers', () => {
    it('editorLog should be defined', () => {
      expect(editorLog).toBeDefined()
      expect(editorLog.info).toBeInstanceOf(Function)
    })

    it('log should be defined', () => {
      expect(log).toBeDefined()
      expect(log.info).toBeInstanceOf(Function)
    })
  })

  describe('perf', () => {
    it('should format duration correctly', () => {
      const log = createLogger('PERF', '#00FF00')
      log.perf('operation', 1234)
      expect(consoleSpy.log).toHaveBeenCalled()
      const args = consoleSpy.log.mock.calls[0]
      expect(args[0]).toContain('1.23s')
    })

    it('should format small duration', () => {
      const log = createLogger('PERF', '#00FF00')
      log.perf('operation', 50)
      expect(consoleSpy.log).toHaveBeenCalled()
      const args = consoleSpy.log.mock.calls[0]
      expect(args[0]).toContain('50ms')
    })
  })
})
