/* eslint-disable @typescript-eslint/no-explicit-any */
import { EApplicationPlatform } from '../constants';
import { AdroitNgUtilsCoreModule } from '../ng-utils-core.module';
import { AdroitNgUtilsModule } from '../ng-utils.module';

/**
 * An Alias decorator for \@RunIn(EApplicationPlatform.Server)
 *
 * @example ```ts
 * \@Component({
 *     selector: 'app-root',
 *     templateUrl: './app.component.html',
 *     styleUrls: ['./app.component.scss']
 * })
 * export class AppComponent {
 *   \@RunInServer()
 *   public set setterThatSetsMetaTags(value) { ... }
 * }
 * ```
 */
export function RunOnServer(): MethodDecorator {
  return RunOnPlatform(EApplicationPlatform.server);
}

/**
 * An Alias decorator for \@RunIn(EApplicationPlatform.Browser)
 *
 * @example ```ts
 * \@Component({
 *     selector: 'app-root',
 *     templateUrl: './app.component.html',
 *     styleUrls: ['./app.component.scss']
 * })
 * export class AppComponent {
 *   \@RunInBrowser()
 *   public set setterThatUsesWindow(value: string) { ... }
 * }
 * ```
 */
export function RunInBrowser(): MethodDecorator {
  return RunOnPlatform(EApplicationPlatform.browser);
}

export function RunInWorkerApp(): MethodDecorator {
  return RunOnPlatform(EApplicationPlatform.browserWorkerApp);
}

export function RunInWorkerUI(): MethodDecorator {
  return RunOnPlatform(EApplicationPlatform.browserWorkerUi);
}

/**
 * A decorator that restricts the usage of methods and accessors.
 *
 * Methods and accessors decorated will only ran (when invoked
 * from the client code), if the application's active platform matches those supplied to the decorator.
 *
 * This makes it easy to optimize various execution scenarios
 * and rid the application of execution paths that would cause problems in certain environments.
 *
 * @param platforms An array of the platform IDs or a single platform ID where the method/accessor can be run.
 *
 * @example ```ts
 * \@Component({
 *     selector: 'app-root',
 *     templateUrl: './app.component.html',
 *     styleUrls: ['./app.component.scss']
 * })
 * export class AppComponent {
 *   \@RunInBrowser()
 *   public set setterThatUsesWindow(value: string) { ... }
 *
 *   \@RunIn(EApplicationPlatform.Browser)
 *   public methodThatUsesWindow(value: string) { ... }
 * }
 * ```
 */
export function RunOnPlatform(
  platforms:
    | keyof typeof EApplicationPlatform
    | [keyof typeof EApplicationPlatform | string[]]
): MethodDecorator {
  return (
    _target: Record<any, any>,
    propKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): void | TypedPropertyDescriptor<any> => {
    if (
      (typeof propKey !== 'string' && typeof propKey !== 'symbol') ||
      typeof descriptor !== 'object'
    ) {
      return descriptor;
    }

    const appliedOn = getApplicationTarget(descriptor);
    if (!appliedOn) {
      return;
    }

    const allowedPlatforms = Array.isArray(platforms) ? platforms : [platforms];

    descriptor[appliedOn] = ((...args: any[]): void => {
      if (
        allowedPlatforms.includes(
          AdroitNgUtilsCoreModule.platformObserver
            .platformID as keyof typeof EApplicationPlatform
        )
      ) {
        descriptor[appliedOn](...args);

        return;
      }

      console.log(
        `Method or accessor: ${propKey.toString()} did not get invoked on platform: ${
          AdroitNgUtilsCoreModule.platformObserver.platformID
        }`
      );
    }) as any;

    return descriptor;
  };
}

/**
 * @internal
 */
function getApplicationTarget(
  descriptor: TypedPropertyDescriptor<any>
): 'value' | 'get' | 'set' | undefined {
  if (typeof descriptor.value === 'function') {
    return 'value';
  }

  if (typeof descriptor.get === 'function') {
    return 'get';
  }

  if (typeof descriptor.set === 'function') {
    return 'set';
  }

  return undefined;
}
