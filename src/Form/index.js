import { Form } from './Form'

export default Vue => {
  Vue.prototype.$form = Form
  Vue.component('g-form', Form)
  Vue.component('g-form-item', Form.FormItem)
  Vue.directive('decorator', {})
}

export * from './Form'
export * from './FormItem'
