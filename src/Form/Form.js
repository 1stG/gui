import Vue from 'vue'

import { FormItem } from './FormItem'
import { createBaseForm } from './createBaseForm'
import { FIELD_META_PROP, FIELD_DATA_PROP } from './constants'

export const Form = {
  name: 'g-form',
  FormItem,
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  provide() {
    return {
      FormProps: this.$props,
      collectFormItemContext:
        this.form &&
        this.form.templateContext &&
        ((context, action = 'add') => {
          const number = this.formItemContexts.get(context) || 0
          if (action === 'delete') {
            if (number <= 1) {
              this.formItemContexts.delete(context)
            } else {
              this.formItemContexts.set(context, number - 1)
            }
          } else if (context !== this.form.templateContext) {
            this.formItemContexts.set(context, number + 1)
          }
        }),
    }
  },
  create(options) {
    return createBaseForm({
      ...options,
      fieldMetaProp: FIELD_META_PROP,
      fieldDataProp: FIELD_DATA_PROP,
    })
  },
  createForm(context) {
    return new Vue(
      Form.create({
        templateContext: context,
      })(),
    )
  },
  created() {
    this.formItemContexts = new Map()
  },
  beforeUpdate() {
    this.formItemContexts.forEach(context => context.$forceUpdate())
  },
  render(h) {
    return <form>{this.$slots.default}</form>
  },
}
