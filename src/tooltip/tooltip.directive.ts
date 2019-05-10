import {
  Directive,
  Input,
  ElementRef,
  TemplateRef,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core'
import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { ReplaySubject } from 'rxjs'

import { TooltipComponent } from './tooltip.component'
import { getOriginPosition, getOverlayPosition } from './util'
import { TooltipTrigger, TooltipType } from './tooltip.types'
import { delay } from '../utils'

@Directive({
  selector: '[gTooltip]',
  exportAs: 'gTooltip',
})
export class TooltipDirective implements AfterViewInit, OnDestroy {
  static DELAY_TIME = 50

  listeners: Array<() => void> = []

  overlayRef: OverlayRef | null = null

  class$$ = new ReplaySubject<string>(1)
  content$$ = new ReplaySubject<string | TemplateRef<any>>(1)
  context$$ = new ReplaySubject<any>(1)
  position$$ = new ReplaySubject<string>(1)
  type$$ = new ReplaySubject<TooltipType>(1)

  @Input('gTooltip') set content(content: string | TemplateRef<any>) {
    this.content$$.next(content)
  }

  private _position = ''

  get position() {
    return this._position
  }

  @Input('gTooltipPosition') set position(position: string) {
    if (this._position === position) {
      return
    }
    this._position = position
    this.position$$.next(position)
    this.updatePosition()
  }

  private _trigger = TooltipTrigger.HOVER

  get trigger() {
    return this._trigger
  }

  @Input('gTooltipTrigger') set trigger(trigger: TooltipTrigger) {
    if (this._trigger === trigger) {
      return
    }
    this._trigger = trigger
    this.updateListeners()
  }

  private _class = ''

  get class() {
    return this._class
  }

  @Input('gTooltipClass') set class(_class: string) {
    if (this._class === _class) {
      return
    }

    this._class = _class
    this.class$$.next(_class)
  }

  private _type = TooltipType.DEFAULT

  get type() {
    return this._type
  }

  @Input('gTooltipType') set type(type: TooltipType) {
    if (this._type === type) {
      return
    }

    this._type = type
    this.type$$.next(type)
  }

  private _context: any

  get context() {
    return this._context
  }

  @Input('gTooltipContext') set context(context: any) {
    if (this._context === context) {
      return
    }

    this._context = context
    this.context$$.next(context)
  }

  @Input() hideOnClick = false

  private get created() {
    return !!this.tooltipIns
  }

  private tooltipIns: TooltipComponent | null = null

  private hostHovered = false
  private tooltipHovered = false

  constructor(
    private elRef: ElementRef,
    private render: Renderer2,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
  ) {}

  ngAfterViewInit() {
    this.updateListeners()
  }

  ngOnDestroy() {
    this.clearListeners()
    this.destroyTooltip()
  }

  updateListeners() {
    this.clearListeners()
    const { nativeElement: el } = this.elRef
    switch (this.trigger) {
      case TooltipTrigger.HOVER: {
        this.listeners.push(
          this.render.listen(el, 'mouseenter', this.onMouseEnter.bind(this)),
          this.render.listen(el, 'mouseleave', this.onMouseLeave.bind(this)),
        )
        break
      }
      case TooltipTrigger.CLICK: {
        this.listeners.push(
          this.render.listen(el, 'click', this.toggleTooltip.bind(this)),
          this.render.listen(
            'document',
            'click',
            this.onDocumentClick.bind(this),
          ),
        )
        break
      }
      case TooltipTrigger.FOCUS: {
        this.listeners.push(
          this.render.listen(el, 'focus', this.onFocus.bind(this)),
          this.render.listen(el, 'blur', this.onBlur.bind(this)),
        )
        break
      }
    }
  }

  clearListeners() {
    this.listeners.forEach(unlisten => unlisten())
    this.listeners = []
  }

  onMouseEnter() {
    this.hostHovered = true
    setTimeout(() => {
      if (this.hostHovered) {
        this.createTooltip()
      }
    }, TooltipDirective.DELAY_TIME)
  }

  onMouseLeave() {
    this.hostHovered = false
    setTimeout(() => {
      if (!this.hostHovered && !this.tooltipHovered) {
        this.destroyTooltip()
      }
    }, TooltipDirective.DELAY_TIME)
  }

  createTooltip() {
    if (this.created) {
      return
    }
    this.createOverlay()
    this.tooltipIns = this.overlayRef!.attach(
      new ComponentPortal(TooltipComponent, this.viewContainerRef),
    ).instance
    this.tooltipIns.setupInputs({
      class$: this.class$$,
      content$: this.content$$,
      context$: this.context$$,
      position$: this.position$$,
      type$: this.type$$,
    })
    if (this.trigger === TooltipTrigger.HOVER) {
      this.tooltipIns.hovered$.subscribe(this.onTooltipHoverChange.bind(this))
    }
  }

  getPositionStrategy() {
    const originPosition = getOriginPosition(this.position)
    const overlayPosition = getOverlayPosition(this.position)
    return this.overlay
      .position()
      .flexibleConnectedTo(this.elRef)
      .withGrowAfterOpen(true)
      .withPositions([
        {
          ...originPosition.main,
          ...overlayPosition.main,
        },
        {
          ...originPosition.fallback,
          ...overlayPosition.fallback,
        },
      ] as ConnectedPosition[])
  }

  createOverlay() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.getPositionStrategy(),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    })
  }

  updatePosition() {
    if (this.overlayRef) {
      this.overlayRef.updatePositionStrategy(this.getPositionStrategy())
    }
  }

  destroyTooltip() {
    if (!this.created) {
      return
    }
    this.overlayRef!.dispose()
    this.overlayRef = null
    this.tooltipIns = null
    this.hostHovered = false
    this.tooltipHovered = false
  }

  toggleTooltip() {
    if (this.overlayRef) {
      this.destroyTooltip()
    } else {
      this.createTooltip()
    }
  }

  onDocumentClick(ev: MouseEvent) {
    const target = ev.target as HTMLElement
    if (
      this.created &&
      !(this.elRef.nativeElement as HTMLElement).contains(target) &&
      (this.hideOnClick ||
        !this.tooltipIns!.elRef.nativeElement.contains(target))
    ) {
      this.destroyTooltip()
    }
  }

  onFocus() {
    this.createTooltip()
  }

  onBlur() {
    this.destroyTooltip()
  }

  async onTooltipHoverChange(hovered: boolean) {
    this.tooltipHovered = hovered
    await delay(TooltipDirective.DELAY_TIME)
    if (!this.hostHovered && !this.tooltipHovered) {
      this.destroyTooltip()
    }
  }
}
