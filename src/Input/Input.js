import { noop } from 'lodash'

export const Input = {
  name: 'g-input',
  model: {
    event: 'change.value',
  },
  props: {
    value: String,
  },
  data() {
    return {
      stateValue: this.value || '',
    }
  },
  watch: {
    value() {
      this.stateValue = this.value || ''
    },
  },
  methods: {
    onChange(e) {
      const { value } = e.target
      this.$emit('change.value', value)
      this.stateValue = value
      this.$emit('change', e)
    },
  },
  render(h) {
    return h('input', {
      staticClass: 'g-input',
      attrs: this.$attrs,
      domProps: {
        value: this.stateValue,
      },
      on: {
        ...this.$listeners,
        input: this.onChange,
        change: noop,
      },
    })
  },
}
