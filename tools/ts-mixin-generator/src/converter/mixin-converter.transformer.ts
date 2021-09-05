import colors from 'colors';
import ts from 'typescript';
import { TsTransformerFactoryBase } from './classes';
import { ClassToMixinVisitor } from './visitors/class.visitor';

export default class ClassToMixinTransformerFactory extends TsTransformerFactoryBase {
  protected visit(node: ts.SourceFile): ts.SourceFile {
    if (!ts.isSourceFile(node)) {
      return node;
    }

    let sourceFile = node as ts.SourceFile;
    console.warn('Transforming file: ' + sourceFile.fileName);

    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

    let transformed = false;

    const classToMixinVisitor = new ClassToMixinVisitor(
      sourceFile,
      this.typeChecker,
      this.config
    );
    if (classToMixinVisitor.shouldTransformSource()) {
      sourceFile = classToMixinVisitor.transformSource();
      transformed = true;
    }

    const s = ts.visitEachChild(
      sourceFile,
      this.visit.bind(this),
      this.context
    );

    if (transformed) {
      console.log(
        colors.green(`
        Transformed ${s.fileName}: \n
        ${printer.printNode(ts.EmitHint.Unspecified, s, s)}`)
      );
    }

    return s;
  }
}
