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
    classDeclaration: ts.ClassDeclaration
  ): boolean {
    return !!ASTUtils.getExtendsClause(classDeclaration)?.types?.length;
  }

  public static doesHaveImplementsClause(
    classDeclaration: ts.ClassDeclaration
  ): boolean {
    return !!ASTUtils.getImplementsClause(classDeclaration)?.types?.length;
  }

  public static isComponentOrDirectiveDeclaration(
    node: ts.Node
  ): node is ts.ClassDeclaration {
    if (!ts.isClassDeclaration(node)) {
      return false;
    }

    const decorators =
      node.decorators ??
      ((node?.['original']?.['decorators'] ??
        []) as ts.NodeArray<ts.Decorator>);

    return !!asNodeArray(decorators).find((decorator) => {
      if (!ts.isCallExpression(decorator.expression)) {
        return false;
      }

      const isComponent = (
        decorator?.expression?.expression?.getText() ?? ''
      ).includes('Component');

      const isDirective = (
        decorator?.expression?.expression?.getText() ?? ''
      ).includes('Directive');

      if (!isComponent && !isDirective) {
        return false;
      }

      const componentDecoratorPropNames = [
        'selector',
        'templateUrl',
        'template',
        'styles',
        'styleUrls',
        'changeDetection',
        'providers',
      ];

      return !!asNodeArray(decorator.expression.arguments).find((arg) => {
        if (!ts.isObjectLiteralExpression(arg)) {
          return false;
        }

        return !!asNodeArray(arg.properties).find((prop) =>
          componentDecoratorPropNames.includes(prop.name.getText())
        );
      });
    });
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

  public static updateSourceFileWithClass(
    sourceFile: ts.SourceFile,
    classDcl: ts.ClassDeclaration
  ): ts.SourceFile {
    if (!ts.isSourceFile(sourceFile) || !ts.isClassDeclaration(classDcl)) {
      return sourceFile;
    }

    const isClassDefinedInFile = asNodeArray(sourceFile.statements).some(
      (stmt) =>
        ts.isClassDeclaration(stmt) &&
        stmt.name.escapedText.toString() ===
          classDcl.name.escapedText.toString()
    );
    if (!isClassDefinedInFile) {
      return sourceFile;
    }

    return ts.updateSourceFileNode(
      sourceFile,
      ts.createNodeArray([
        ...asNodeArray(sourceFile.statements).map((statement) => {
          if (
            !ts.isClassDeclaration(statement) ||
            statement.name.escapedText.toString() !==
              classDcl.name.escapedText.toString()
          ) {
            return statement;
          }

          return classDcl;
        }),
      ])
    );
  }

  public static updateCtorDeclarationOfClass(
    classDcl: ts.ClassDeclaration,
    ctorDcl: ts.ConstructorDeclaration
  ): ts.ClassDeclaration {
    if (
      !ts.isClassDeclaration(classDcl) ||
      !ts.isConstructorDeclaration(ctorDcl)
    ) {
      return classDcl;
    }

    return ts.updateClassDeclaration(
      classDcl,
      classDcl.decorators,
      classDcl.modifiers,
      classDcl.name,
      classDcl.typeParameters,
      classDcl.heritageClauses,
      [
        ...asNodeArray(classDcl.members).map((member) => {
          return !ts.isConstructorDeclaration(member) ? member : ctorDcl;
        }),
      ]
    );
  }

  public static updateConstructorWithAugmentedParam(
    ctorDcl: ts.ConstructorDeclaration,
    paramDcl: ts.ParameterDeclaration
  ): ts.ConstructorDeclaration {
    if (!ts.isConstructorDeclaration(ctorDcl) || !ts.isParameter(paramDcl)) {
      return ctorDcl;
    }

    return ts.updateConstructor(
      ctorDcl,
      ctorDcl.decorators,
      ctorDcl.modifiers,
      [
        ...asNodeArray(ctorDcl.parameters).map((ctorParam) =>
          (ctorParam.name as ts.Identifier).escapedText.toString() !==
          (paramDcl.name as ts.Identifier).escapedText.toString()
            ? ctorParam
            : paramDcl
        ),
      ],
      ctorDcl.body
    );
  }
}
