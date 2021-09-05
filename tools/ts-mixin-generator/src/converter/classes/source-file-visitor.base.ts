import ts from 'typescript';
import { ITsMixinGeneratorConfig } from '../interfaces';

export abstract class ASourceFileVisitor {
  protected readonly sourceFile: ts.SourceFile;

  constructor(
    rootNode: ts.SourceFile,
    protected readonly typeChecker: ts.TypeChecker,
    protected readonly config: ITsMixinGeneratorConfig
  ) {
    if (!ts.isSourceFile(rootNode)) {
      throw new Error(
        `SourceFileVisitor expected a ts.sourceFile but got: ${rootNode} instead.`
      );
    }

    this.sourceFile = rootNode;
  }

  public abstract shouldTransformSource(): boolean;

  public abstract transformSource(): ts.SourceFile;
}
