/**
 * An Error throw when a singleton module is loaded more than once.
 * This error should not be handled in the app because it indicates that a module that supposed to be included only once was included more than once.
 * Instead scenarios which would result in this error should be found and fixed during development.
 *
 * @example
 * ```ts
 *  throw new ModuleLoadError(((self as unknown) as Function).name);
 * ```
 */
export class ModuleLoadError extends Error {
  constructor(public readonly moduleName: string) {
    super(
      `${moduleName} is already loaded. Make sure to only import it once directly or indirectly in AppModule`
    );
  }
}
