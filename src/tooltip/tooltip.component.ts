import {
  Component,
  TemplateRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core'
import { Observable, Subject, combineLatest } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

import { TooltipType } from './tooltip.types'

@Component({
  selector: 'g-tooltip',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  template: `
    <div
      [ngClass]="class$ | async"
      (mouseenter)="hovered$.next(true)"
      (mouseleave)="hovered$.next(false)"
    >
      <ng-container *ngIf="isString(content$ | async)">
        {{ content$ | async }}
      </ng-container>
      <ng-container
        *ngIf="!isString(content$ | async)"
        [ngTemplateOutlet]="content$ | async"
        [ngTemplateOutletContext]="context$ | async"
      ></ng-container>
    </div>
  `,
  styleUrls: ['./tooltip.component.less'],
})
export class TooltipComponent {
  class$?: Observable<string>
  content$?: Observable<string | TemplateRef<any>>
  context$?: Observable<any>
  position$?: Observable<string>

  hovered$ = new Subject<boolean>()

  constructor(public elRef: ElementRef) {}

  isString(content: unknown) {
    return typeof content === 'string'
  }

  setupInputs({
    class$,
    content$,
    context$,
    position$,
    type$,
  }: {
    class$: Observable<string>
    content$: Observable<string | TemplateRef<any>>
    context$: Observable<any>
    position$: Observable<string>
    type$: Observable<TooltipType>
  }) {
    this.content$ = content$
    this.context$ = context$
    this.class$ = combineLatest(
      class$.pipe(startWith('')),
      position$.pipe(startWith('')),
      type$.pipe(startWith(TooltipType.DEFAULT)),
    ).pipe(
      map(([className, position, type]) => {
        const block = 'g-tooltip'
        const direction = position.split(' ')[0]
        return type === TooltipType.PLAIN
          ? `${block}--${direction} ${className}`
          : `${block} ${block}--${type} ${block}--${direction} ${className}`
      }),
    )
  }
}
