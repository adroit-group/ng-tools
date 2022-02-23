import { InjectionToken } from "@angular/core";
import { IRecognizedParam } from "../interfaces";

export const RECOGNIZED_QUERY_PARAM = new InjectionToken<IRecognizedParam>(
  'Recognized query param token'
);
