/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ComponentRef,
  Directive,
  EventEmitter,
  Injector,
  Input,
  NgModuleRef,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

/**
 * Interface for the event emitted by the {@link NgComponentOutletAugmentationDirective}
 */
export interface NgComponentOutletEvent {
  key: string;
  event: Record<string, unknown>;
}

/**
 * {@inheritdoc NgComponentOutlet}
 */
@Directive({
  selector: '[ngComponentOutlet]',
  exportAs: 'ngComponentOutlet',
})
export class NgComponentOutletAugmentationDirective
  implements OnChanges, OnDestroy
{
  @Input() public ngComponentOutlet: Type<unknown> | null = null;

  @Input() public ngComponentOutletInjector?: Injector;

  @Input() public ngComponentOutletContent?: Node[][];

  @Input() public ngComponentOutletNgModule?: Type<unknown>;

  @Input() public ngComponentOutletInputs?: Record<string, unknown>;

  @Output() public readonly componentEvent =
    new EventEmitter<NgComponentOutletEvent>();

  public componentRef: ComponentRef<Record<string, unknown>> | undefined;

  public readonly moduleRef: NgModuleRef<unknown> | undefined;

  constructor(public readonly viewContainerRef: ViewContainerRef) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.clearComponentIfNeeded(changes);

    if (!this.componentRef && this.ngComponentOutlet) {
      this.createComponent();
      this.hookUpOutputs();
    }

    this.hookUpInputs();
  }

  public ngOnDestroy(): void {
    if (this.moduleRef) this.moduleRef.destroy();
  }

  private createComponent(): void {
    const injector: Injector =
      this.ngComponentOutletInjector || this.viewContainerRef.parentInjector;

    this.componentRef = this.viewContainerRef.createComponent(
      this.ngComponentOutlet as Type<Record<string, unknown>>,
      {
        index: this.viewContainerRef.length,
        injector,
        ngModuleRef: this.moduleRef,
        projectableNodes: this.ngComponentOutletContent,
      }
    );
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
    if (this.ngComponentOutletInputs && this.componentRef) {
      for (const [key, value] of Object.entries(this.ngComponentOutletInputs)) {
        this.componentRef.setInput(key, value);
      }
    }
  }

  private clearComponentIfNeeded(changes: SimpleChanges): void {
    if (
      changes['ngComponentOutlet']?.currentValue &&
      changes['ngComponentOutlet']?.currentValue !==
        changes['ngComponentOutlet']?.previousValue
    ) {
      this.viewContainerRef.clear();
      this.componentRef = undefined;
    }
  }
}
