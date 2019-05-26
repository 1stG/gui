import { noop } from 'lodash'

import { FIELD_META_PROP, FIELD_DATA_PROP } from './constants'
import {
  getSlotOptions,
  filterEmpty,
  cloneVNodes,
  getAllChildren,
} from '../utils'

export const FormItem = {
  name: 'g-form-item',
  __G_FORM_ITEM: true,
  inject: {
    FormProps: {
      default: () => ({}),
    },
    collectFormItemContext: {
      default: () => noop,
    },
  },
  props: {
    label: String,
  },
  created() {
    this.collectContext()
  },
  beforeDestroy() {
    this.collectFormItemContext(this.$vnode.context, 'delete')
  },
  methods: {
    collectContext() {
      if (this.FormProps.form && this.FormProps.form.templateContext) {
        this.collectFormItemContext(this.$vnode.context)
      }
    },
    getControls(vnodes = []) {
      const controls = []
      for (let i = 0, len = vnodes.length; i < len; i++) {
        const vnode = vnodes[i]
        if (!vnode.tag && vnode.text && !vnode.text.trim()) {
          continue
        }

        if (getSlotOptions(vnode).__G_FORM_ITEM) {
          continue
        }

        const attrs = (vnode.data && vnode.data.attrs) || {}

        if (FIELD_META_PROP in attrs) {
          controls.push(vnode)
        } else {
          const children = getAllChildren(vnode)
          if (children.length) {
            controls.push(...this.getControls(children))
          }
        }
      }
      return controls
    },
    getOnlyControl() {
      const control = this.getControls(this.slotDefault)[0]
      return control !== undefined ? control : null
    },
    getChildAttr(prop) {
      const child = this.getOnlyControl()
      if (!child) {
        return undefined
      }
      let data = {}
      if (child.data) {
        data = child.data
      } else if (child.$vnode && child.$vnode.data) {
        data = child.$vnode.data
      }
      return data[prop] || data.attrs[prop]
    },
    getHelpMessage() {
      const control = this.getOnlyControl()
      if (control) {
        const field = this.getChildAttr(FIELD_DATA_PROP)
        if (field.errors) {
          return field.errors.map(({ message }) => message).join(' ')
        }
      }
      return null
    },
    decoratorOption(vnode) {
      if (vnode.data && vnode.data.directives) {
        const directive = vnode.data.directives.find(
          d => d.name === 'decorator',
        )
        return directive && directive.value
      } else {
        return null
      }
    },
    decoratorChildren(vnodes) {
      const { getFieldDecorator } = this.FormProps.form
      for (let i = 0, len = vnodes.length; i < len; i++) {
        const vnode = vnodes[i]
        if (getSlotOptions(vnode).__G_FORM_ITEM) {
          break
        }
        if (vnode.children) {
          vnode.children = this.decoratorChildren(cloneVNodes(vnode.children))
        } else if (vnode.componentOptions && vnode.componentOptions.children) {
          vnode.componentOptions.children = this.decoratorChildren(
            cloneVNodes(vnode.componentOptions.children),
          )
        }
        const options = this.decoratorOption(vnode)
        if (options && options[0]) {
          vnodes[i] = getFieldDecorator(options[0], options[1])(vnodes[i])
        }
      }
      return vnodes
    },
    renderLabel() {
      const { label, $createElement: h } = this
      return label ? h('span', [label]) : null
    },
    renderHelp() {
      return this.getHelpMessage()
    },
    renderChildren() {
      return [this.renderLabel(), this.slotDefault, this.renderHelp()]
    },
  },
  render(h) {
    const { FormProps } = this
    let child = filterEmpty(this.$slots.default || [])
    if (FormProps.form) {
      child = cloneVNodes(child)
      this.slotDefault = this.decoratorChildren(child)
    } else {
      this.slotDefault = child
    }
    const children = this.renderChildren()
    return <div>{children}</div>
  },
}
