import { Inject, Injectable, Injector, Optional } from '@angular/core';
import { IBusinessLogicConfig, IBusinessLogicDefinition } from '../interfaces';
import { BUSINESS_LOGIC_CONFIG } from '../tokens';

@Injectable({
  providedIn: 'root',
})
export class BusinessLogicRegistry {
  readonly #logics = new Map<
    string,
    Array<IBusinessLogicDefinition<any, any>>
  >();

  constructor(
    private readonly injector: Injector,
    @Optional()
    @Inject(BUSINESS_LOGIC_CONFIG)
    private readonly businessLogicConfigs: Array<IBusinessLogicConfig>
  ) {
    if (!Array.isArray(this.businessLogicConfigs)) {
      this.businessLogicConfigs = [];
    }
  }

  public init(): void {
    for (const { type, logics } of this.businessLogicConfigs) {
      this.#logics.set(type, this.resolveDepsForBusinessLogics(logics));
    }
  }

  public getLogic(
    businessLogicName: string
  ): Array<IBusinessLogicDefinition<any, any>> {
    return this.#logics.get(businessLogicName) ?? [];
  }

  public hasLogic(businessLogicName: string): boolean {
    return this.#logics.has(businessLogicName);
  }

  private resolveDepsForBusinessLogics<
    T extends IBusinessLogicDefinition<any, any>
  >(logics: Array<T>): Array<T> {
    return (logics ?? []).map((logic) => ({
      ...logic,
      deps: Array.isArray(logic?.deps)
        ? logic.deps.map((dep) => this.injector.get(dep))
        : [],
    }));
  }
}
