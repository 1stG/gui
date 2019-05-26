import { storiesOf } from '@storybook/vue'
import Vue from 'vue'

import Form from '../src/Form'
import Input from '../src/Input'

Vue.use(Form)
Vue.use(Input)

storiesOf('Form', module).add('default', () => ({
  data() {
    return {
      form: this.$form.createForm(this),
    }
  },
  render(h) {
    const { form } = this
    return (
      <g-form form={form}>
        <g-form-item label="Test">
          {form.getFieldDecorator('test', {
            initialValue: 'test',
            rules: [
              {
                required: true,
                message: 'Test 必填',
              },
            ],
          })(<g-input />)}
        </g-form-item>
        <g-form-item>
          <g-input
            v-decorator={[
              'msg',
              {
                initialValue: 'Hello World',
                rules: [
                  {
                    required: true,
                    message: 'Msg 必填',
                  },
                ],
              },
            ]}
          />
        </g-form-item>
      </g-form>
    )
  },
}))
