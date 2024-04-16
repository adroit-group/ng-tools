/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable max-classes-per-file */
import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { EApplicationPlatform } from '../constants';
import { PlatformObserverService } from '../services';

/**
 * A structural directive that allows the rendering on templates based on the platform the application is running on.
 * The typical use case of the directive is to enable the usage of different templates for different rendering modes, eg.: usae a different view when the application is ran in SSR.
 *
 * @example ```html
 * <app-splash-screen *ngRenderIn="'browser'"></app-splash-screen>
 *
 * <!-- With alternative template -->
 * <app-splash-screen *ngRenderIn="'browser' or ssrTpl"></app-splash-screen>
 *
 * <ng-template #ssrTpl>...</ng-template>
 * ```
 *
 * There are two utility versions of this directive
 * NgRenderInBrowser (*ngRenderInBrowser) and NgRenderInServer (*ngRenderServer)
 * that do exactly what their names suggest.
 */
@Directive({
  selector: '[ngRenderIn]',
  standalone: true
})
export class NgRenderInDirective implements OnInit, OnDestroy {
  @Input('ngRenderIn') public platform!: keyof typeof EApplicationPlatform;

  @Input('ngRenderInOr') public alternativeTemplate?: TemplateRef<unknown>;

  protected _embeddedView!: EmbeddedViewRef<unknown>;

  constructor(
    protected readonly vcr: ViewContainerRef,
    protected readonly templateRef: TemplateRef<unknown>,
    protected readonly platformObserver: PlatformObserverService
  ) {}

  public ngOnInit(): void {
    if (this.platformObserver.platformID === this.platform) {
      this._embeddedView = this.vcr.createEmbeddedView(this.templateRef);
    } else if (this.alternativeTemplate) {
      this._embeddedView = this.vcr.createEmbeddedView(
        this.alternativeTemplate
      );
    }
  }

  public ngOnDestroy(): void {
    if (!this._embeddedView.destroyed) {
      this._embeddedView.destroy();
    }
  }
}

/**
 * A structural directive that only renders it's template if the application is ran in the browser.
 *
 * @example ```html
 * <app-splash-screen *ngRenderInBrowser></app-splash-screen>
 *
 * <!-- With alternative template -->
 * <app-splash-screen *ngRenderInBrowser="or ssrTpl"></app-splash-screen>
 *
 * <ng-template #ssrTpl>...</ng-template>
 * ```
 */
@Directive({
  selector: '[ngRenderInBrowser]',
  standalone: true
})
export class NgRenderInBrowserDirective extends NgRenderInDirective {
  public override readonly platform = EApplicationPlatform.browser;

  @Input('ngRenderInBrowserOr')
  public override alternativeTemplate?: TemplateRef<unknown>;
}

/**
 * A structural directive that only renders it's template if the application is ran in the server environment (SSR).
 *
 * @example ```html
 * <app-splash-screen *ngRenderInServer></app-splash-screen>
 *
 * <!-- With alternative template -->
 * <app-splash-screen *ngRenderInServer="or browserTpl"></app-splash-screen>
 *
 * <ng-template #browserTpl>...</ng-template>
 * ```
 */
@Directive({
  selector: '[ngRenderInServer]',
  standalone: true
})
export class NgRenderInServerDirective extends NgRenderInDirective {
  public override readonly platform = EApplicationPlatform.server;

  @Input('ngRenderInServerOr')
  public override alternativeTemplate?: TemplateRef<unknown>;
}
