import { Constructor } from '@adroit/ng-utils';
import colors from 'colors';
import { Program as TsMorphProgram } from 'ts-morph';
import ts from 'typescript';
import { ITsMixinGeneratorConfig } from '../interfaces';

export abstract class TsTransformerFactoryBase<
  Type extends ts.Node = ts.SourceFile
> {
  public static instantiateTransformerFactory(
    program: ts.Program,
    config: Record<string, any>
  ): ts.TransformerFactory<ts.SourceFile> {
    if (typeof config !== 'object') {
      throw new Error('Expected a valid TS mixin generator config');
    }

    const { name, ...otherConfigs } = config;
    if (!name) {
      throw new Error(
        'Encountered an invalid ngx-angular-compiler-plugin ts transformer config. Configured TS transformers must have name to be resolvable.'
      );
    }

    const tsTransformerFactory =
      TsTransformerFactoryBase.loadTsTransformer(name);
    if (typeof tsTransformerFactory !== 'function') {
      throw new Error(
        `ngx-angular-compiler-plugin encountered an error: The TS transformer ${name} exported a non newable default member.
          Configured TS transformers must export a transformer factory class that extends the TsTransformerFactory base class as their default member.`
      );
    }

    try {
      const restArgs = Array.isArray(otherConfigs) ? otherConfigs : [];
      const factory = new tsTransformerFactory(program, ...restArgs);

      if (!(factory instanceof TsTransformerFactoryBase)) {
        throw new Error(
          'Encountered an invalid ngx-angular-compiler-plugin ts transformer! TS transformers must extend the TsTransformer base class.'
        );
      }

      return factory.getTransformerFactory();
    } catch (error) {
      throw new Error(
        `Failed to instantiate ngx-angular-compiler-plugin ts transformer! InnerException: ${error}`
      );
    }
  }

  protected get typeChecker(): ts.TypeChecker {
    if (this._typeChecker) {
      return this._typeChecker;
    }

    const typeChecker =
      this.program instanceof TsMorphProgram
        ? this.program.compilerObject.getTypeChecker()
        : this.program?.getTypeChecker() ?? null;

    if (typeof typeChecker !== 'object') {
      throw new TypeError(
        `Could not obtain TS typechecker! Make sure to configure the build properly.`
      );
    }

    this._typeChecker = typeChecker as any;
    return this._typeChecker;
  }

  private static loadTsTransformer(
    name: string
  ): Constructor<TsTransformerFactoryBase, any[]> {
    if (name.startsWith('~')) {
      name = process.cwd() + '/' + name.substr(1);
    }

    return require(name).default;
  }

  protected context: ts.TransformationContext;

  private _typeChecker: ts.TypeChecker;

  constructor(
    protected readonly program: ts.Program | TsMorphProgram,
    protected readonly config: ITsMixinGeneratorConfig
  ) {}

  public getTransformerFactory(): ts.TransformerFactory<ts.SourceFile> {
    return (context: ts.TransformationContext) => {
      this.context = context;

      const transformerName = this['constructor']['name'];
      console.log(colors.yellow(`${transformerName} TRANSFORMER...`));

      return (rootNode: ts.SourceFile) => {
        return ts.visitNode(rootNode, this.visit.bind(this));
      };
    };
  }

  protected abstract visit(node: Type): Type;
}
