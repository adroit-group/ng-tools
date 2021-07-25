/**
 * An enum of the directive lifecycle hooks provided by Angular
 */
export enum ELifeCycleHook {
  ngOnChanges = 'ngOnChanges',
  ngOnInit = 'ngOnInit',
  ngAfterViewInit = 'ngAfterViewInit',
  ngAfterContentInit = 'ngAfterContentInit',
  ngAfterViewChecked = 'ngAfterViewChecked',
  ngAfterContentChecked = 'ngAfterContentChecked',
  ngDoCheck = 'ngDoCheck',
  ngOnDestroy = 'ngOnDestroy',
}
