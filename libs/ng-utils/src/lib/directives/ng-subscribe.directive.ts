/* eslint-disable max-classes-per-file */
import {
  ChangeDetectorRef,
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

/**
 * Az NgSubscribe direktíva által használt kontextus objektum.
 * Ez az objektum tartja számon a definiált tempalte változó értékét és típusát.
 */
export class NgSubscribeContext<T extends any> {
  /**
   * A tempalte kontextus 'implicit' értéke.
   */
  public $implicit: T = null;
  /**
   * A tempalte kontextus nevesített értéke.
   */
  public ngSubscribe: T = null;
}

/**
 * Struktúrális direktíva, ami lehővé teszi a async értékek 'kicsomagolását' az angular-os tempalte-kben az 'as' kulcsóval.
 * Az angular saját struktúrális direktívái (ngIf, ngFor) képesek a direktíva $implicit bindolt értékét 'kihúzni'
 * a temapltebe egy template variable segítségével.
 * Ez azért hasznos feature számunkra, mert a $implicit bind-ban szerepelő értéket pipe-okkal
 * (pl.: async) tudjuk transzformálni a tempalte export elött.
 * Ez a direktív ugyan ezt a funkciót hivatott megvalósítani az extra funckiók nélkül.
 * Nem rejte el/mutat meg, nemsokszorosít semmit. Csupán felíratkozik az $implicit pozicióban kapott értékre,
 * amit aztán az 'as' lulcsóval ki tudunk exportálni a tempalte-be.
 *
 * @example ```html
 * <div *ngSubscribe="xs$ as isXsActive"> ... </div>
 * ```
 */
@Directive({
  selector: '[ngSubscribe]',
})
export class NgSubscribeDirective<T> implements OnInit, OnDestroy {
  /**
   * Az inputként kapott observable.
   */
  private observable: Observable<any>;
  /**
   * A kontextus egy példánya.
   */
  private context = new NgSubscribeContext<T>();
  /**
   * A direktíva input observable-jét kezelő susbscription.
   */
  private subscription: Subscription;

  /**
   * Az érték, mely a direktíva által definiálva lesz tempalte változóban.
   */
  @Input()
  public set ngSubscribe(inputObservable: Observable<T>) {
    if (this.observable !== inputObservable) {
      this.observable = inputObservable;
      this.subscription && this.subscription.unsubscribe();
      this.subscription = this.observable.subscribe((value) => {
        this.context.ngSubscribe = value;
        this.cdr.markForCheck();
      });
    }
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
    private readonly templateRef: TemplateRef<NgSubscribeContext<T>>
  ) {}

  /**
   * Az Angular language service által használt segéd függvény, mely lehetővé teszi a tempalte béli type inferálást.
   *
   * @param _dir A direktíva osztály példánya
   * @param ctx A direktívához tartozó kontextus objektum.
   */
  public static ngTemplateContextGuard<T>(
    _dir: NgSubscribeDirective<T>,
    ctx: unknown
  ): ctx is NgSubscribeContext<T> {
    return true;
  }

  /**
   * A direktíva és a tempalte inicializálása.
   */
  public ngOnInit(): void {
    this.vcr.createEmbeddedView(this.templateRef, this.context);
  }

  /**
   * A direktíva destruktor logikája
   */
  public ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }
}
