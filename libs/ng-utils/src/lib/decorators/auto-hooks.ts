/* eslint-disable no-constant-condition */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/ban-types */
import { ELifeCycleHook } from '../enums';

/**
 * Egy speciális érték, melyet a dekorátor használ az automatikus bindolás megfelelő működéséhez.
 * Az érték célja az, hogy ha egy prototipus láncban több osztályon is szerepel az AutoHooks dekorátor,
 * akkor a később kiértékelt dekorátor megtalálja az elötte kiértékelt dekorátor
 * és ne történjen többszöri újra bindolás ugyan abban a prototipus láncban.
 */
const AUTO_HOOKS_MARK = '__auto-wire-up-angular-hooks__';

/**
 * hook fn és az őt tartalmazó prototype
 */
interface TProtoHook {
  hook: () => any;
  proto: object;
}

/**
 * Egy utility függvény, mely egy osztály konstruktorához rendeli annak a prototipus objektumát vagy ha azt nem találja null-t ad vissza.
 *
 * @param target
 */
const getParentProto = (target: Function): Object =>
  typeof target === 'function'
    ? Object.getPrototypeOf(target)?.prototype ?? null
    : null;

// const getParentCtor = (target: Function): Function =>
//   typeof target === 'function' ? Object.getPrototypeOf(target) ?? null : null;

/**
 * Egy utility függvény, mely egy osztály konstruktoráról össze gyüjti az osztály prototipus láncán található függvényeket.
 *
 * @param target Az osztály konstruktor függvénye, melyről a függvényeket össze szeretnénk gyüjteni.
 * @param hookName A függvény neve, melyet meg szeretnénk találni.
 */
function gatherHookRecursively(
  target: Function,
  hookName: string
): Array<TProtoHook> {
  const hookFns: Array<TProtoHook> = [];

  const targetHookFn = target.prototype[hookName];
  if (typeof targetHookFn === 'function') {
    hookFns.push({
      hook: targetHookFn,
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

    const parentHookFn = (parentProto as Record<PropertyKey, any>)[
      hookName
    ] as () => any;
    if (typeof parentHookFn === 'function') {
      hookFns.push({
        hook: parentHookFn,
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

function shouldAugmentPreV10Hooks(
  target: Function,
  hookName: string,
  recognizedLifeCycleHookMethods: Array<string>
): boolean {
  const isLifecycleHookMethod =
    recognizedLifeCycleHookMethods.includes(hookName);

  return isLifecycleHookMethod && (target as Record<PropertyKey, any>)['ɵcmp'];
}

function augmentPreV10Hooks(
  hookName: string,
  target: Function,
  callableHooksWithOwningPrototypes: Array<TProtoHook>
) {
  const compFeatureName = hookName
    .replace('ng', '')
    .split('')
    .map((char, i) => (i === 0 ? char.toLowerCase() : char))
    .join('');

  (target as Record<PropertyKey, any>)['ɵcmp'][compFeatureName] = function (
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

function augmentV10Hooks(
  hookName: string,
  target: Function,
  callableHooksWithOwningPrototypes: Array<TProtoHook>
) {
  (target as Record<PropertyKey, any>)[hookName] = function (
    ...args: Array<any>
  ) {
    callableHooksWithOwningPrototypes.forEach((hookWithOwningPrototype) =>
      hookWithOwningPrototype.hook.apply<any, any[], any>(this, args)
    );
  };
}

/**
 * A mixin-eket használó komponensek és direktívák életciklus metódusainak megfelelő működésért felelős dekorátor.
 * A dekorátor an Angular specifikus életciklus metódusok (és a paraméterként megadott további metódusok) automatikus bind-olását végzi el.
 * A bind-olás közben a prototipus lánc egyes elemein jelen lévő metódusokat köti össze,
 * így az azonos nevű metódusok a gyerek példány metódusának meghívása során sorban meghívpdnak
 * a konstructor hívások láncolatához hasonlóan.
 *
 * @param additionalHooks Egy tömb mely az Angular életciklus metódusain kivül további bind-olandó metódusok neveit tartalmazza.
 * (opcionális)
 * A dekorátorral ellátott osztály nem hívhatják saját maguk az Angular specifikus életciklus metódusaik
 * és a további bindolt metódusaik super változatait a függvény türzsükben, mivel ez az adott metódusok többszöri meghívását eredméynezné.
 * Az Angular ngOnChanges életciklus metódusa nem kerül automatikus meghívásra mivel az nem kapja meg
 * a megfelelő changes paramétert (Angular v10 elött).
 */
export function AutoHooks(additionalHooks: Array<string> = []): ClassDecorator {
  const recognizedLifeCycleHookMethods = Object.values(
    ELifeCycleHook
  ) as Array<string>;

  const hooksToWireUp = [...recognizedLifeCycleHookMethods, ...additionalHooks];

  // eslint-disable-next-line @typescript-eslint/ban-types
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
      shouldAugmentPreV10Hooks(target, hookName, recognizedLifeCycleHookMethods)
        ? augmentPreV10Hooks(
            hookName,
            target,
            callableHooksWithOwningPrototypes
          )
        : augmentV10Hooks(hookName, target, callableHooksWithOwningPrototypes);
    }

    Object.defineProperty(target, Symbol.for(AUTO_HOOKS_MARK), {
      value: true,
      writable: false,
      configurable: false,
    });

    return target as any;
  };
}
