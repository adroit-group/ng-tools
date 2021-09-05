/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable max-classes-per-file */
import {
  ChangeDetectorRef,
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

/**
 * Az NgLet direktíva által használt kontextus objektum.
 * Ez az objektum tartja számon a definiált tempalte változó értékét és típusát.
 */
export class NgLetContext<T> {
  /**
   * A tempalte kontextus 'implicit' értéke.
   */
  public $implicit?: T;
  /**
   * A tempalte kontextus nevesített értéke.
   */
  public ngLet?: T;
}

/**
 * Struktúrális direktíva, mely a tempalte változók definiálását könnyíti meg.
 *
 * @example ```html
 *  <div *ngLet="item.route && item.returnRoute as realRoundtrip"> ... </div>
 * ```
 */
@Directive({
  selector: '[ngLet]',
})
export class NgLetDirective<T> implements OnInit {
  /**
   * Az előző input cache-t értéke.
   */
  #memoizedValue: unknown;

  /**
   * A kontextus egy példánya.
   */
  private context = new NgLetContext<T>();

  /**
   * Az érték, mely a direktíva által definiálva lesz tempalte változóban.
   */
  @Input()
  public set ngLet(input: T) {
    if (input === this.#memoizedValue) {
      return;
    }
    this.#memoizedValue = input;
    this.context.ngLet = input;
    this.cdr.markForCheck();
  }

  /**
   * Konstruktor
   *
   * @param vcr A direktíva host elementjéhez tartozó view referenciája
   * @param cdr Az Angular változás kezelő service.
   * @param templateRef A direktíva template-jének refereniája.
   */
  constructor(
    private readonly vcr: ViewContainerRef,
    private readonly cdr: ChangeDetectorRef,
    private readonly templateRef: TemplateRef<NgLetContext<T>>
  ) {}

  /**
   * Az Angular language service által használt segéd függvény, mely lehetővé teszi a tempalte béli type inferálást.
   *
   * @param _dir A direktíva osztály példánya
   * @param ctx A direktívához tartozó kontextus objektum.
   * @typedef T Az NgLet direktíva kontextusában tárolt érték típusa
   */
  public static ngTemplateContextGuard<T>(
    _dir: NgLetDirective<T>,
    ctx: unknown
  ): ctx is NgLetContext<T> {
    return true;
  }

  /**
   * A direktíva és a tempalte inicializálása.
   */
  public ngOnInit(): void {
    this.vcr.createEmbeddedView(this.templateRef, this.context);
  }
}
