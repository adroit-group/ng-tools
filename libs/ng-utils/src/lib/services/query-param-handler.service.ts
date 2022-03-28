import { Injectable } from '@angular/core';
import { QueryParamsHandling } from '@angular/router';
import { Observable } from 'rxjs';

export interface IQueryParamParser {
  parse: (urlVal: string) => any
}

export interface IQueryParamSerializer {
  serialize: (inputVal: any) => string
}

export interface IQueryParamHandler {
  parser?: IQueryParamParser,
  serializer?: IQueryParamSerializer
}

export interface IQueryParamOptions extends IQueryParamHandler {
  key?: string;                               // Ezen a néven fogja beletenni az urlbe
  sync: 'change' | 'signal'                  // Url frissítése válotzásra vagy jelzés esetén
  type?: string;                              // Ezen a néven keres a queryParamTypeHandlerMap-ban handlert hozzá
  parser?: IQueryParamParser;                 // Ez alakítja az urlben lévő cuccot value formába amit betesz a formcontrol-ba
  serializer?: IQueryParamSerializer;         // Ez alakítja a value-t urlben betehető formában
  debounceTime?: number;                      // Change vagy signal esetén alkalmazódik
  replaceUrl?: boolean;                       // Ez megy a routernek ugyan ilyen néven
  queryParamsHandling?: QueryParamsHandling | null; // Ez megy a routernek ugyan ilyen néven
  refreshUrl$?: Observable<any>;              // Ha a sync signal akkor erre figyelve serializálja az url-be a value-t
}

@Injectable({
  providedIn: 'root'
})
export class QueryParamsHandlerService {

  public defaultQueryParamOption: IQueryParamOptions = {
    type: 'string',
    sync: 'change',
    replaceUrl: true,
    queryParamsHandling: 'merge'
  }

  public queryParamTypeHandlerMap: Map<string, IQueryParamHandler> = new Map<string, IQueryParamHandler>();

  constructor() {
    this.queryParamTypeHandlerMap.set('string', {
      parser: { parse: (val) => val },
      serializer: { serialize: (val) => val}
    });

    this.queryParamTypeHandlerMap.set('number', {
      parser: { parse: (val) => Number(val) },
      serializer: { serialize: (val) => val}
    });

    this.queryParamTypeHandlerMap.set('boolean', {
      parser: { parse: (val) => !!Number(val) },
      serializer: { serialize: (val) => val ? '1' : '0'}
    });
  }
}
