import { InjectionToken } from '@angular/core';

/**
 * @example
 * ```ts
 *   Component({
 *       selector: 'app-filters',
 *       templateUrl: './filters.component.html',
 *       styleUrls: ['./filters.component.scss'],
 *       viewProviders: [
 *           {
 *               provide: METHOD_INVOKER_PIPE_HOST,
 *               useExisting: forwardRef(() => FiltersComponent)
 *           }
 *       ]
 *   })
 *  ```
 */
export const METHOD_INVOKER_PIPE_HOST = new InjectionToken(
  'Method Invoker Host'
);
