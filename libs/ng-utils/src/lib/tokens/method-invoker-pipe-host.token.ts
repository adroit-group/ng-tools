import { InjectionToken } from '@angular/core';

/**
 * A MethodInvoker pipe ( | invoke ) számára megadható host komponens vagy direktíva regisztálásához használható InjectionToken
 * A Token-t provide-olva egy komponens vagy direktíva példánya elérhető a method inoker pipe számára
 * és az osztály this értéke használható lesz a pipe által meghívott komponens/direktíva methódusában.
 *
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
