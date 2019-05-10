import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  HostBinding,
  Input,
} from '@angular/core'

import { ButtonTypes, ButtonHtmlTypes } from './button.types'

const BTN_PREFIX = 'g-btn--'

@Component({
  selector: '[gBtn]',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  template: `
    <span><ng-content></ng-content></span>
  `,
  styleUrls: ['./button.component.less'],
})
export class ButtonComponent {
  @Input() type = ButtonTypes.DEFAULT
  @Input() htmlType = ButtonHtmlTypes.BUTTON

  @HostBinding('class.g-btn') gBtn = true
  @HostBinding(`class.${BTN_PREFIX}primary`) get isPrimary() {
    return this.type === ButtonTypes.PRIMARY
  }
  @HostBinding(`class.${BTN_PREFIX}dashed`) get isDashed() {
    return this.type === ButtonTypes.DASHED
  }
  @HostBinding(`class.${BTN_PREFIX}danger`) get isDanger() {
    return this.type === ButtonTypes.DANGER
  }
  @HostBinding(`class.${BTN_PREFIX}link`) get isLink() {
    return this.type === ButtonTypes.LINK
  }
  @HostBinding('attr.type') get _htmlType() {
    return this.htmlType || ButtonHtmlTypes.BUTTON
  }
}
