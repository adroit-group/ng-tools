import ts from 'typescript';
import { asNodeArray } from '../utils';

export abstract class ASTUtils {
  public static organizeImportsFirstInFile(
    sourceFile: ts.SourceFile
  ): ts.SourceFile {
    if (!ts.isSourceFile(sourceFile)) {
      return sourceFile;
    }

    const organizedStatements = asNodeArray(sourceFile.statements).sort(
      (a, b) => {
        const isAImportStmt = ts.isImportDeclaration(a);
        const isBImportStmt = ts.isImportDeclaration(b);

        return isAImportStmt && !isBImportStmt
          ? -1
          : !isAImportStmt && isBImportStmt
          ? 1
          : 0;
      }
    );

    // TODO: Lehete az importokat abc sorrendbe tenni, de ezen a ponton az újjonnan beszúrt statementeknek nem kiolvasható a module neve.
    // ? Lehet ezt emit fázisban kéne meg csinálni
    // const organizedStatementsWithOrganizedImports = organizedStatements.sort(
    //   (a, b) => {
    //     if (!ts.isImportDeclaration(a)) {
    //       return 1;
    //     }

    //     if (!ts.isImportDeclaration(b)) {
    //       return -1;
    //     }

    //     const isInserted = (stmt: ts.Statement, source: ts.SourceFile) =>
    //       stmt?.parent === source;

    //     const moduleSpecifierOfA = isInserted(a, sourceFile)
    //       ? a.moduleSpecifier['text']
    //       : a?.moduleSpecifier.getText(sourceFile);
    //     const moduleSpecifierOfB = isInserted(b, sourceFile)
    //       ? b.moduleSpecifier['text']
    //       : b?.moduleSpecifier.getText(sourceFile);

    //     return moduleSpecifierOfA <= moduleSpecifierOfB ? -1 : 1;
    //   }
    // );

    return ts.factory.updateSourceFile(
      sourceFile,
      organizedStatements,
      sourceFile.isDeclarationFile,
      sourceFile.referencedFiles,
      sourceFile.typeReferenceDirectives,
      sourceFile.hasNoDefaultLib,
      sourceFile.libReferenceDirectives
    );
  }

  public static addImport(
    sourceFile: ts.SourceFile,
    symbolName: string,
    moduleName: string
  ): ts.SourceFile {
    if (!ts.isSourceFile(sourceFile)) {
      return sourceFile;
    }

    return ts.updateSourceFileNode(
      sourceFile,
      ts.createNodeArray([
        ts.createImportDeclaration(
          undefined,
          undefined,
          ts.createImportClause(
            undefined,
            ts.createNamedImports([
              ts.createImportSpecifier(
                undefined,
                ts.createIdentifier(symbolName)
              ),
            ])
          ),
          ts.createLiteral(moduleName)
        ),
        ...asNodeArray(sourceFile.statements),
      ])
    );
  }

  public static getExtendsClause(
    classDeclaration: ts.ClassDeclaration | ts.ClassExpression
  ): ts.HeritageClause {
    return asNodeArray(classDeclaration?.heritageClauses).find(
      (clause) => clause.token === ts.SyntaxKind.ExtendsKeyword
    );
  }

  public static getImplementsClause(
    classDeclaration: ts.ClassDeclaration | ts.ClassExpression
  ): ts.HeritageClause {
    return asNodeArray(classDeclaration?.heritageClauses).find(
      (clause) => clause.token === ts.SyntaxKind.ImplementsKeyword
    );
  }

  public static doesHaveExtendsClause(
    classDeclaration: ts.ClassDeclaration | ts.ClassExpression
  ): boolean {
    return !!ASTUtils.getExtendsClause(classDeclaration)?.types?.length;
  }

  public static doesHaveImplementsClause(
    classDeclaration: ts.ClassDeclaration | ts.ClassExpression
  ): boolean {
    return !!ASTUtils.getImplementsClause(classDeclaration)?.types?.length;
  }

  public static removeDuplicateImports(
    sourceFile: ts.SourceFile
  ): ts.SourceFile {
    if (!ts.isSourceFile(sourceFile)) {
      return sourceFile;
    }

    const importStatements = asNodeArray(sourceFile.statements).filter(
      ts.isImportDeclaration
    );

    const uniqueImports = importStatements.reduce((acc, curr) => {
      const { moduleSpecifier, importClause } = curr;
      const moduleName = moduleSpecifier.getText(sourceFile);
      const importedSymbols = asNodeArray(
        (importClause.namedBindings as ts.NamedImports).elements
      ).map((importSpecifier) => importSpecifier.name.getText(sourceFile));

      const importFromSameModule = acc.find(
        (importDcl) =>
          importDcl.moduleSpecifier.getText(sourceFile) === moduleName
      );

      const hasImportsFromSameModule = !!importFromSameModule;
      if (!hasImportsFromSameModule) {
        return [...acc, curr];
      }

      return acc;
    }, [] as ts.ImportDeclaration[]);

    return ts.factory.updateSourceFile(
      sourceFile,
      [
        ...uniqueImports,
        ...asNodeArray(sourceFile.statements).filter(
          (st) => !ts.isImportDeclaration(st)
        ),
      ],
      sourceFile.isDeclarationFile,
      sourceFile.referencedFiles,
      sourceFile.typeReferenceDirectives,
      sourceFile.hasNoDefaultLib,
      sourceFile.libReferenceDirectives
    );
  }

  public static hasImportsFromModule(
    sourceFile: ts.SourceFile,
    moduleName: string
  ): boolean {
    if (ts.isClassDeclaration(sourceFile)) {
      return false;
    }

    return asNodeArray(sourceFile.statements).some(
      (stmt) =>
        ts.isImportDeclaration(stmt) &&
        (stmt.moduleSpecifier as ts.StringLiteral).text === moduleName
    );
  }

  public static hasToAddImport(
    sourceFile: ts.SourceFile,
    importName: string,
    importModule: string
  ): boolean {
    if (!ts.isSourceFile(sourceFile)) {
      return false;
    }

    return !asNodeArray(sourceFile.statements)
      .filter((stmt) => ts.isImportDeclaration(stmt))
      .some((importDcl: ts.ImportDeclaration) => {
        (importDcl.moduleSpecifier as ts.StringLiteral).text === importModule &&
          asNodeArray(importDcl.importClause.namedBindings?.['elements']).some(
            (importSpecifier: ts.ImportSpecifier) =>
              importSpecifier?.name?.escapedText?.toString() === importName
          );
      });
  }
}
