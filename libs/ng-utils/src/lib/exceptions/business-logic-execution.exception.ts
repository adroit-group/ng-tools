export class BusinessLogicExecutionException extends Error {
  public readonly context: any;
  public readonly innerException!: Error;

  constructor(message?: string);
  constructor(
    logicType: string,
    logicName: string,
    logicContext?: any,
    innerException?: Error
  );
  constructor(...args: unknown[]) {
    const [messageOrLogicType, logicName, logicContext, innerException] = args;

    const message =
      args.length <= 1
        ? `${messageOrLogicType}`
        : `An exception occoured while running ${messageOrLogicType} business logics in ${logicName} logic.`;

    super(message);

    if (typeof logicContext === 'object') {
      this.context = logicContext;
    }

    if (innerException instanceof Error) {
      this.innerException = innerException;
    }
  }
}
