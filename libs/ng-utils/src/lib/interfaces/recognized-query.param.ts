
export interface IRecognizedParamHandlerArgs {
  paramValue: string | any;
  [key: string]: any;
};


export interface IRecognizedParam {
  name: string;
  value: string;
  handler: (value: IRecognizedParamHandlerArgs) => void | Promise<void>;
}
