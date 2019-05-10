import { storiesOf } from '@storybook/angular'

import { TooltipModule } from '../../tooltip/public-api'
import { ButtonModule } from '../../button/public-api'

import '@angular/cdk/overlay-prebuilt.css'

storiesOf('tooltip', module).add('default', () => ({
  moduleMetadata: {
    imports: [ButtonModule, TooltipModule],
  },
  template: /* HTML */ `
    <button
      gBtn
      [gTooltip]="tooltip"
      [gTooltipPosition]="position"
      (click)="onClick()"
    >
      Hover to Show Tooltip!
    </button>
    <button
      gBtn
      gTooltip="tooltip"
      gTooltipPosition="top"
      gTooltipTrigger="click"
      gTooltipType="primary"
    >
      Click to Show Tooltip!
    </button>
    <button
      gBtn
      [gTooltip]="tooltipWithContext"
      [gTooltipContext]="{ name: 'Hello', $implicit: 'World' }"
      gTooltipPosition="bottom"
      gTooltipTrigger="focus"
    >
      Focus to Show Tooltip!
    </button>
    <ng-template #tooltip>Tooltip Content</ng-template>
    <ng-template let-name="name" let-suffix #tooltipWithContext>{{ name }} {{ suffix }}</ng-template>
  `,
  props: {
    position: '',
    onClick() {
      this.position = this.position ? '' : 'bottom'
    },
  },
}))
