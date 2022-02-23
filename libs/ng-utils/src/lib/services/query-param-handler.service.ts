import { Inject, Injectable, Injector, Optional } from '@angular/core';
import { Params } from '@angular/router';
import { IRecognizedParam } from '../interfaces';
import { RECOGNIZED_QUERY_PARAM } from '../tokens';
import { HashMap } from '../types';


@Injectable({
  providedIn: 'root',
})
export class QueryParamHandlerService {
  private readonly paramDataMap = new Map<string, HashMap>();

  constructor(
    @Optional()
    @Inject(RECOGNIZED_QUERY_PARAM)
    protected rootTokens: IRecognizedParam | IRecognizedParam[] = [],
    protected injector: Injector
  ) {}

  public get tokens(): IRecognizedParam[] {
    return Array.isArray(this.rootTokens) ? this.rootTokens : [this.rootTokens];
  }

  public setParamData(dataKey: string, data: HashMap): void {
    this.paramDataMap.set(dataKey, data);
  }

  public async handleQueryParams(queryParams: Params): Promise<void> {
    if (!this.tokens || this.tokens.length === 0) {
      return;
    }

    for (const paramName of Object.keys(queryParams)) {
      const recognizedParam = this.tryRecognizeParam(paramName);
      if (recognizedParam) {
        await this.handleParam(recognizedParam, queryParams);
        break;
      }
    }
  }

  private tryRecognizeParam(paramName: string): IRecognizedParam | undefined {
    return this.tokens.find((recognized) => recognized.name === paramName);
  }

  private async handleParam(
    { name, value, handler }: IRecognizedParam,
    queryParams: Params
  ): Promise<void> {
    const paramValue = value === '$value' ? queryParams[name] : value;

    const hasParamData = this.paramDataMap.has(name);
    const paramData = hasParamData ? this.paramDataMap.get(name) : {};

    if (hasParamData) {
      this.paramDataMap.delete(name);
    }

    await handler({ ...paramData, paramValue });
  }
}
