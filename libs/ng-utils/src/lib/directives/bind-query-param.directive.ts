import { Directive, Input, OnDestroy, OnInit, Self } from "@angular/core";
import { NgControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { IQueryParamOptions, QueryParamsHandlerService } from '@app/services/query-param-handler.service';
import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";

// Output event a query param change ről
@Directive({
  selector: "[appBindQueryParam]",
  exportAs: 'queryParamDirective'
})
export class BindQueryParamDirective implements OnInit, OnDestroy {

  _queryParamOptions: IQueryParamOptions;
  @Input('appBindQueryParam') set queryParamOptions(options: string | IQueryParamOptions) {
    if (typeof options === 'string' || options instanceof String) {
      this._queryParamOptions = Object.assign(this._queryParamOptions, this.queryParamsHandlerService.queryParamTypeHandlerMap.get('string'), { key: options});
    } else {
      this._queryParamOptions = Object.assign(this._queryParamOptions, this.queryParamsHandlerService.queryParamTypeHandlerMap.get(options.type ?? 'string'), options);
    }

    this.signalSub?.unsubscribe();
    if (this._queryParamOptions.sync === 'signal') {
      this.signalSub = this._queryParamOptions.refreshUrl$.pipe(takeUntil(this.unsub), debounceTime(this._queryParamOptions.debounceTime ?? 0), distinctUntilChanged()).subscribe(() => {
        if (this._queryParamOptions.sync === 'signal') {
          this.refreshUrl(this.ngControl.value);
        }
      });
    }
  }

  private unsub: Subject<any> = new Subject();
  private signalSub: Subscription;

  constructor(
    @Self() private ngControl: NgControl,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private queryParamsHandlerService: QueryParamsHandlerService
  ) {
    this._queryParamOptions = Object.assign({}, this.queryParamsHandlerService.defaultQueryParamOption);
  }

  public ngOnInit(): void {
    const params = new URLSearchParams(location.search);

    if (params.has(this._queryParamOptions.key)) {
//      console.log('Init control', this.key);
      const previeousValue = this.ngControl.control.value;
      this.ngControl.control.patchValue(this._queryParamOptions.parser.parse(params.get(this._queryParamOptions.key)));
      if (this.ngControl.control.invalid) {
        this.ngControl.control.patchValue(previeousValue);
      }
    }

    this.ngControl.valueChanges.pipe(takeUntil(this.unsub), debounceTime(this._queryParamOptions.debounceTime ?? 0), distinctUntilChanged()).subscribe((res) => {
      if (this._queryParamOptions.sync === 'change') {
        this.refreshUrl(this.ngControl.value);
      }
    });
  }

  public ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }

  private refreshUrl(value: any): void {
    // Ha nem valid a kontrol akkor nem frissítjük az urlt
    if (this.ngControl.control.invalid) {
      return;
    }

    const queryParams = {};
    queryParams[this._queryParamOptions.key] = this._queryParamOptions.serializer.serialize(value);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: this._queryParamOptions.queryParamsHandling,
      replaceUrl: this._queryParamOptions.replaceUrl
    });
  }
}
