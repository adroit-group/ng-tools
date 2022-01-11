/* eslint-disable no-constant-condition */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/ban-types */
import { ELifeCycleHook } from '../enums';

/**
 * @internal
 */
const AUTO_HOOKS_MARK = '__auto-wire-up-angular-hooks__';

/**
 * @internal
 */
interface TProtoHook {
  hook: () => any;
  proto: object;
}

/**
 * @internal
 */
const getParentProto = (target: Function): Object =>
  typeof target === 'function'
    ? Object.getPrototypeOf(target)?.prototype ?? null
    : null;

/**
 * @internal
 */
function gatherHookRecursively(
  target: Function,
  hookName: string
): Array<TProtoHook> {
  const hookFns: Array<TProtoHook> = [];

  const targetHookFnDesc = Object.getOwnPropertyDescriptor(
    target.prototype,
    hookName
  );
  if (
    typeof targetHookFnDesc === 'object' &&
    typeof targetHookFnDesc.value === 'function'
  ) {
    hookFns.push({
      hook: targetHookFnDesc.value,
      proto: target.prototype,
    });
  }

  let parentProto = getParentProto(target);
  while (true) {
    if (parentProto === null) {
      break;
    }

    if (
      (parentProto.constructor as Record<PropertyKey, any>)[
        Symbol.for(AUTO_HOOKS_MARK) as any
      ]
    ) {
      throw new Error(`
        Invalid usage of @AutoHooks decorator encountered!
        Only one class per prototype chain can be decorated by the @AutoHooks decorator.
        Class ${parentProto.constructor.name} is already decorated by @AutoHooks
        but appears in the prototype chain of another class decorated by it.
      `);
    }

    const parentHookFnDesc = Object.getOwnPropertyDescriptor(
      parentProto,
      hookName
    );
    if (
      typeof parentHookFnDesc === 'object' &&
      typeof parentHookFnDesc.value === 'function'
    ) {
      hookFns.push({
        hook: parentHookFnDesc.value,
        proto: parentProto,
      });
    }

    if (parentProto.constructor.hasOwnProperty(Symbol.for(AUTO_HOOKS_MARK))) {
      break;
    }

    parentProto = getParentProto(parentProto.constructor);
  }

  return hookFns.reverse();
}

/**
 * @internal
 */
function shouldAugmentPreV10Hooks(
  targetCtor: Function,
  hookName: string,
  recognizedLifeCycleHookMethods: Array<string>
): boolean {
  const isLifecycleHookMethod =
    recognizedLifeCycleHookMethods.includes(hookName);

  return isLifecycleHookMethod && !!(targetCtor as any)['ɵcmp'];
}

/**
 * @internal
 */
function augmentPreV10Hooks(
  hookName: string,
  targetCtor: Function,
  callableHooksWithOwningPrototypes: Array<TProtoHook>
) {
  const compFeatureName = hookName
    .replace('ng', '')
    .split('')
    .map((char, i) => (i === 0 ? char.toLowerCase() : char))
    .join('');

  (targetCtor as any)['ɵcmp'][compFeatureName] = function (
    ...args: Array<any>
  ) {
    callableHooksWithOwningPrototypes.forEach((hookWithOwningPrototype) => {
      const protoCtrIsMarkedAsFirst =
        hookWithOwningPrototype.proto.constructor.hasOwnProperty(
          Symbol.for('firstInProtoChain')
        );

      return hookWithOwningPrototype.hook.apply<any, any[], any>(
        protoCtrIsMarkedAsFirst ? this : hookWithOwningPrototype.proto,
        args
      );
    });
  };
}

/**
 * @internal
 */
function augmentHooksInV10Mode(
  hookName: string,
  target: any,
  callableHooksWithOwningPrototypes: Array<TProtoHook>
) {
  target[hookName] = function (...args: Array<any>) {
    callableHooksWithOwningPrototypes.forEach((hookWithOwningPrototype) =>
      hookWithOwningPrototype.hook.apply<any, any[], any>(this, args)
    );
  };
}

/**
 * A decorator which ensures that the lifecycle hooks of components and directives that use mixins are called properly.
 * The decorator applies automatic binding for the Angular specific lifecycle hook and the additionally supplied methods on classes  extending mixin functions by linking up the existing methods on the classes' prototype chains.
 * This ensures that both the components' own methods and any other method on the mixins' prototypes are called in the same order in which constructor calls would do. (Starting with the last mixin class and calling continuosly toward the actual class that extends the mixins)
 * @param additionalHooks An array of method names to be bound on top of the Angular lifecycle hooks
 * @remarks Nor the classes decorated with AutoHooks decorator neither the mixin or base classes applied to it are allowed to manually call the super version of the methods being bound.
 * That would result in unintended and multiply invocation of said methods.
 * The ngOnChanges hook is exempt from this behaviour when the decorator is used with an Angular version less than v10 as binding this lifecycle hooks results in a faulty behavior where the method does not receive the changes parameter object.
 * If a class's prototype chain contains real classes apart from the applied mixins those classes cannot use AutoHooks in tandem with the child class's decorator.
 * @example ```ts
 * \@Component({
 *   selector: 'my-comp',
 *   templateUrl: './my.component.html',
 *   styleUrls: ['./my.component.scss'],
 * })
 * \@AutoHooks()
 * export class MyComp extends SubscriptionHandlerMixin() implements OnInit { ... }
 * ```
 */
export function AutoHooks(additionalHooks: Array<string> = []): ClassDecorator {
  const recognizedLifeCycleHookMethods = Object.values(
    ELifeCycleHook
  ) as Array<string>;

  const hooksToWireUp = [...recognizedLifeCycleHookMethods, ...additionalHooks];

  return (target: Function) => {
    if (typeof target !== 'function') {
      throw new TypeError(`
        AutoHooks decorator expected a class constructor function but got: ${target}!
        Make sure to only use AutoHooks as a class decorator.
      `);
    }

    for (const hookName of hooksToWireUp) {
      // ! OnChanges hook does not receive the changes argument when called as a feature. (prior to v10)
      // TODO: This might work and can be removed under v10.
      if (hookName === ELifeCycleHook.ngOnChanges) {
        continue;
      }

      const callableHooksWithOwningPrototypes = gatherHookRecursively(
        target,
        hookName
      );
      if (callableHooksWithOwningPrototypes.length === 0) {
        continue;
      }

      // ? We have to hook into Angular's component feature's private api to properly modify the lifecycle hooks
      // ? since the AOT generated code contains the _decorate function call after the component class definitions
      // ? Angular do not recognize the a decorate has modified the component's lifecycle hooks.
      if (
        shouldAugmentPreV10Hooks(
          target,
          hookName,
          recognizedLifeCycleHookMethods
        )
      ) {
        augmentPreV10Hooks(hookName, target, callableHooksWithOwningPrototypes);
      }

      augmentHooksInV10Mode(
        hookName,
        target.prototype,
        callableHooksWithOwningPrototypes
      );
    }

    Object.defineProperty(target, Symbol.for(AUTO_HOOKS_MARK), {
      value: true,
      writable: false,
      configurable: false,
    });

    return target as any;
  };
}
