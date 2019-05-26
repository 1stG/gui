import { storiesOf } from '@storybook/vue'

import GButton from '../src/Button'

storiesOf('Button', module).add('default', () => ({
  methods: {
    onClick() {
      console.log('onClick')
    },
  },
  components: {
    GButton,
  },
  render(h) {
    return h(
      GButton,
      {
        staticClass: 'my-btn',
        class: [{ primary: true }],
        on: {
          click: this.onClick,
        },
      },
      1234,
    )
  },
}))
