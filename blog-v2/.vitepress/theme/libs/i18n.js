import locals from '../languages/en-US'

// lang 固定 en-US(旧站 zh-CN 从未启用)
// $tt('hello') -> '你好'
export default {
  install(app) {
    app.config.globalProperties.$tt = function (field) {
      return locals[field] || field
    }
  }
}
