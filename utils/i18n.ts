/**
 * platform-shared i18n — 统一 vue-i18n 封装
 *
 * 各子项目传入自己的语言包，框架配置统一。
 */
import { createI18n as createVueI18n, type I18n, type I18nOptions } from 'vue-i18n'

export type LocaleMessages = Record<string, Record<string, unknown>>

export interface CreateI18nOptions {
  locale?: string
  fallbackLocale?: string
  messages: LocaleMessages
}

export function createI18n(options: CreateI18nOptions): I18n {
  const config: I18nOptions = {
    legacy: false,
    globalInjection: true,
    locale: options.locale ?? 'zh-CN',
    fallbackLocale: options.fallbackLocale ?? 'zh-CN',
    messages: options.messages,
  }
  return createVueI18n(config)
}

export { useI18n } from 'vue-i18n'
