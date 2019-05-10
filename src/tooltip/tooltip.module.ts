import { OverlayModule } from '@angular/cdk/overlay'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { TooltipDirective } from './tooltip.directive'
import { TooltipComponent } from './tooltip.component'

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [TooltipComponent, TooltipDirective],
  exports: [TooltipComponent, TooltipDirective],
  entryComponents: [TooltipComponent],
})
export class TooltipModule {}
