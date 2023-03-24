/* eslint-disable @angular-eslint/no-output-rename */
/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NgComponentOutlet } from '@angular/common';
import {
  ComponentRef,
  Directive,
  EventEmitter,
  Injector,
  Input,
  NgModuleRef,
  Output,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';

/**
 * Interface for the event emitted by the {@link NgComponentOutletAugmentationDirective}
 */
export interface NgComponentOutletEvent {
  key: string;
  event: Record<string, unknown>;
}

/**
 * Augments the {@link NgComponentOutlet} directive to allow for binding of inputs and outputs.
 *
 * @example
 * In your lazy loaded component define the input and outputs you wish to bind to.
 *
 * ```ts
 * \@Component({
 *  selector: 'lazy-loaded-component',
 *  template: `...`
 * })
 * export class LazyLoadedComponent {
 *  \@Input() public input1: string;
 *
 * \@Output() public output1 = new EventEmitter<string>();
 * }
 *
 * ```
 *
 * In the template where you wish to use the component, use the directive to bind the inputs and outputs.
 *
 * ```html
 * <ng-container *ngComponentOutlet="lazyLoadedComp$ | async; inputs: { input1: 'test' }"></ng-container>
 * ```
 *
 * If you want to bind to the lazy loaded components outputs' as well, then you have to use the non-micro-syntax version of the directive, as the micro-syntax version does not support binding to outputs.
 *
 * ```html
 * <ng-container
 *  [ngComponentOutlet]="lazyLoadedComp$ | async"
 *  [ngComponentOutletInputs]="{ input1: 'test' }"
 *  [ngComponentOutletOutputs]="onComponentEvent($event)">
 * </ng-container>
 * ```
 *
 * Then in your component, you can handle the event like so:
 *
 * ```ts
 *
 * export class MyComponentThatUsesLazyLoadedComponent {
 *  public onComponentEvent(event: NgComponentOutletEvent): void {
 *    if (event.key === 'output1') {
 *      // do something with the received event data through event.event
 *    }
 *  }
 * }
 * ```
 */
@Directive({
  selector: '[ngComponentOutlet]',
  exportAs: 'ngComponentOutlet',
})
export class NgComponentOutletAugmentationDirective {
  @Input('ngComponentOutlet') public component: Type<unknown> | null = null;

  @Input('ngComponentOutletInjector') public injector?: Injector;

  @Input('ngComponentOutletContent') public content?: Node[][];

  @Input('ngComponentOutletNgModule') public ngModule?: Type<unknown>;

  @Input('ngComponentOutletInputs') public inputs?: Record<string, unknown>;

  @Output('ngComponentOutletOutputs') public readonly componentEvent =
    new EventEmitter<NgComponentOutletEvent>();

  private originalNgOnChanges!: (changes: SimpleChanges) => void;

  public get componentRef(): ComponentRef<Record<string, unknown>> | undefined {
    return this.ngComponentOutlet['_componentRef'];
  }

  public readonly moduleRef: NgModuleRef<unknown> | undefined;

  constructor(
    public readonly viewContainerRef: ViewContainerRef,
    public readonly ngComponentOutlet: NgComponentOutlet
  ) {
    this.originalNgOnChanges = this.ngComponentOutlet.ngOnChanges.bind(
      this.ngComponentOutlet
    );
    this.ngComponentOutlet.ngOnChanges = this.augmentedNgOnChanges.bind(this);
  }

  private augmentedNgOnChanges(changes: SimpleChanges): void {
    this.originalNgOnChanges(changes);

    const compChange = changes['ngComponentOutlet'];
    if (compChange && compChange.currentValue !== compChange.previousValue) {
      this.hookUpOutputs();
    }

    this.hookUpInputs();
  }

  private hookUpOutputs(): void {
    Object.entries(this.componentRef!.instance)
      .filter(([, value]) => value instanceof EventEmitter)
      .forEach(([key, value]) => {
        (value as EventEmitter<Record<string, unknown>>).subscribe((event) => {
          this.componentEvent.emit({ key, event });
        });
      });
  }

  private hookUpInputs(): void {
    if (!this.inputs || typeof this.inputs !== 'object') {
      return;
    }

    if (this.inputs && this.componentRef) {
      for (const [key, value] of Object.entries(this.inputs)) {
        this.componentRef.setInput(key, value);
      }
    }
  }
}
