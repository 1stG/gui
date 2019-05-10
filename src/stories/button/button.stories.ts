import { storiesOf } from '@storybook/angular'

import { ButtonModule } from '../../button/public-api'

import './button.stories.less'

storiesOf('Button', module).add('types', () => ({
  moduleMetadata: {
    imports: [ButtonModule],
  },
  template: /* HTML */ `
    <div class="button-stories">
      <button
        gBtn
        [disabled]="disabled"
        [type]="type"
        htmlType="htmlType"
        (click)="onClick()"
      >
        Primary
      </button>
      <button gBtn [disabled]="disabled">Default</button>
      <button gBtn [disabled]="disabled" type="dashed">Dashed</button>
      <button gBtn [disabled]="disabled" type="danger">Danger</button>
      <a gBtn [ngClass]="{disabled: disabled}" type="link">Link</a>
    </div>
  `,
  props: {
    type: 'primary',
    htmlType: undefined,
    disabled: false,
    onClick() {
      this.type = this.type ? undefined : 'primary'
      this.htmlType = this.htmlType ? undefined : 'submit'
      this.disabled = !this.disabled
    },
  },
}))
