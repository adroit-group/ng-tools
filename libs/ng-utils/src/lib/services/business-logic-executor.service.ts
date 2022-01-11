import { Inject, Injectable } from '@angular/core';
import { BusinessLogicExecutionException } from '../exceptions';
import { IBusinessLogicContext, IBusinessLogicDefinition } from '../interfaces';
import { BUSINESS_LOGIC_EXECUTOR_THROW_BEHAVIOR } from '../tokens';
import { BusinessLogicRegistry } from './business-logic-registry.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessLogicExecutor {
  constructor(
    private readonly registry: BusinessLogicRegistry,
    @Inject(BUSINESS_LOGIC_EXECUTOR_THROW_BEHAVIOR)
    private readonly defaultThrowBehavior: boolean
  ) {}

  public runBusinessLogic(
    businessLogicName: string,
    input: any,
    businessLogicContext: IBusinessLogicContext,
    shouldThrow: boolean = false
  ): any {
    if (!this.registry.hasLogic(businessLogicName)) {
      if (shouldThrow || this.defaultThrowBehavior) {
        throw new BusinessLogicExecutionException(
          `Could not find registered business logic for name: ${businessLogicName}`
        );
      } else {
        return null;
      }
    }

    let currentLogic: any = null;
    try {
      return this.registry
        .getLogic(businessLogicName)
        .reduce((acc, curr: IBusinessLogicDefinition<any, any>) => {
          currentLogic = curr;

          return curr.isApplicable({
            input,
            businessLogicContext,
            resolvedDeps: curr.deps,
          })
            ? curr.fix({
                input,
                businessLogicContext,
                resolvedDeps: curr.deps,
              })
            : acc;
        }, input);
    } catch (error) {
      throw new BusinessLogicExecutionException(
        businessLogicName,
        currentLogic?.name,
        businessLogicContext,
        error as Error
      );
    }
  }
}
