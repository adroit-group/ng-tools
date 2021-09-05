import ts from 'typescript';
import { ASourceFileVisitor, ASTUtils } from '../classes';
import { DuplicateHandlingStrategy } from '../interfaces/config';
import { asNodeArray } from '../utils';

interface CompleteMixinDeclaration {
  mixinInterface: ts.InterfaceDeclaration;
  mixinFunction: ts.FunctionDeclaration;
}

interface MixinClassExpressionAndDeclarations {
  mixinClassExpression: ts.ClassExpression;
  generatedMixinDeclarations: CompleteMixinDeclaration[];
}

interface A {}
interface B {}
interface C {}

interface Merged extends A, B, C {}

export class ClassToMixinVisitor extends ASourceFileVisitor {
  private classDeclarations: ts.ClassDeclaration[];

  private mixinsGeneratedFromSuperClasses: CompleteMixinDeclaration[];

  public shouldTransformSource(): boolean {
    const classDeclarations = asNodeArray(this.sourceFile.statements).filter(
      ts.isClassDeclaration
    );

    const shouldTransform = classDeclarations.length > 0;
    if (shouldTransform) {
      this.classDeclarations = classDeclarations;
    }

    return shouldTransform;
  }

  public transformSource(): ts.SourceFile {
    let updatedSourceFile = this.sourceFile;

    for (const classDeclaration of this.classDeclarations) {
      const { mixinFunction, mixinInterface } =
        this.generateMixinFromClass(classDeclaration);

      updatedSourceFile = ts.factory.updateSourceFile(updatedSourceFile, [
        mixinInterface,
        mixinFunction,
        ...asNodeArray(updatedSourceFile.statements),
      ]);

      if (
        ASTUtils.hasToAddImport(
          updatedSourceFile,
          'Constructor',
          '../interfaces'
        )
      ) {
        updatedSourceFile = ASTUtils.addImport(
          updatedSourceFile,
          'Constructor',
          '../interfaces'
        );
      }
    }

    return ASTUtils.organizeImportsFirstInFile(updatedSourceFile);
  }

  private generateMixinFromClass(
    classDeclaration: ts.ClassDeclaration
  ): CompleteMixinDeclaration {
    const mixinFunction = this.createMixinFunctionFromClass(classDeclaration);
    const mixinInterface =
      this.createMixinInterfaceDeclaration(classDeclaration);

    return {
      mixinFunction,
      mixinInterface,
    };
  }

  // private mergeInterfaceDeclarations(): ts.InterfaceDeclaration {}

  private createMixinFunctionFromClass(
    classDeclaration: ts.ClassDeclaration
  ): ts.FunctionDeclaration {
    const { className, mixinInterfaceName } =
      this.getClassAndInterfaceNames(classDeclaration);

    const { mixinClassExpression, generatedMixinDeclarations } =
      this.createMixinClass(classDeclaration);

    const generatedMixiNFunctionDeclarations = generatedMixinDeclarations.map(
      ({ mixinFunction }) => mixinFunction
    );

    const extendsClauseWithAppliedSuperClassMixins =
      this.constructExtendsClauseFromSuperClassMixins(
        mixinClassExpression,
        generatedMixiNFunctionDeclarations
      );

    const implementsClauseWithAppliedSuperClassMixinInterfaces =
      this.constructImplementsClauseFromSuperClassMixins(
        mixinClassExpression,
        generatedMixiNFunctionDeclarations
      );

    const mixinClassExprsWithAppliedSuperClassMixins =
      ts.factory.updateClassExpression(
        mixinClassExpression,
        mixinClassExpression.decorators,
        mixinClassExpression.modifiers,
        mixinClassExpression.name,
        mixinClassExpression.typeParameters,
        [
          extendsClauseWithAppliedSuperClassMixins,
          implementsClauseWithAppliedSuperClassMixinInterfaces,
        ],
        mixinClassExpression.members
      );

    return ts.factory.createFunctionDeclaration(
      [],
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      undefined,
      `${className}Mixin`,
      [
        ts.factory.createTypeParameterDeclaration(
          'T',
          this.createCtorTypeNode(),
          ts.factory.createTypeReferenceNode('FunctionConstructor')
        ),
      ],
      [
        ts.factory.createParameterDeclaration(
          [],
          [],
          undefined,
          'base',
          ts.factory.createToken(ts.SyntaxKind.QuestionToken),
          ts.factory.createTypeReferenceNode('T'),
          undefined
        ),
      ],
      ts.factory.createTypeReferenceNode('MixinType', [
        ts.factory.createTypeReferenceNode('T'),
        ts.factory.createTypeReferenceNode(mixinInterfaceName),
      ]),
      ts.factory.createBlock(
        [
          this.createMixinBaseClassStatement(),
          ts.factory.createReturnStatement(
            ts.factory.createAsExpression(
              mixinClassExprsWithAppliedSuperClassMixins,
              ts.factory.createTypeReferenceNode('any', [])
            )
          ),
        ],
        true
      )
    );
  }

  private constructImplementsClauseFromSuperClassMixins(
    mixinClassExpression: ts.ClassExpression,
    superClassMixins: ts.FunctionDeclaration[]
  ) {
    const originalImplementsClause =
      ASTUtils.getImplementsClause(mixinClassExpression);
    if (!superClassMixins?.length) {
      return originalImplementsClause;
    }

    const superClassInterfaces = superClassMixins
      .map(this.getMixinClassExpressionFromMixinFunctionDeclaration)
      .map((classDcl) => ASTUtils.getImplementsClause(classDcl).types)
      .reduce(
        (acc, curr) => [...acc, ...curr],
        [] as ts.ExpressionWithTypeArguments[]
      );

    const uniqueAndOrderedMixinAndSuperClassinterfaces = [
      ...asNodeArray(originalImplementsClause.types),
      ...superClassInterfaces,
    ].reduce((acc, curr) => {
      const isUnique = acc.every(
        (type) =>
          (type.expression as ts.Identifier).escapedText !==
          (curr.expression as ts.Identifier).escapedText
      );

      return isUnique ? [...acc, curr] : acc;
    }, [] as ts.ExpressionWithTypeArguments[]);

    return ts.factory.createHeritageClause(
      ts.SyntaxKind.ImplementsKeyword,
      uniqueAndOrderedMixinAndSuperClassinterfaces
    );
  }

  private constructExtendsClauseFromSuperClassMixins(
    mixinClassExpression: ts.ClassExpression,
    superClassMixins: ts.FunctionDeclaration[]
  ): ts.HeritageClause {
    const originalExtendsClause =
      ASTUtils.getExtendsClause(mixinClassExpression);
    if (!superClassMixins?.length) {
      return originalExtendsClause;
    }

    const mixinFunctionBaseClassParam = originalExtendsClause.types[0];

    return ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
      ts.factory.createExpressionWithTypeArguments(
        this.constructCallExprsRecursively(
          superClassMixins,
          mixinFunctionBaseClassParam
        ),
        undefined
      ),
    ]);
  }

  private constructCallExprsRecursively(
    superClassMixins: ts.FunctionDeclaration[],
    baseParam: ts.ExpressionWithTypeArguments
  ): ts.CallExpression {
    const clonedList = [...superClassMixins];
    const nextSuperClassMixin = clonedList.shift();

    return ts.factory.createCallExpression(
      nextSuperClassMixin.name,
      undefined,
      [
        clonedList.length
          ? this.constructCallExprsRecursively(clonedList, baseParam)
          : baseParam.expression,
      ]
    );
  }

  private createMixinClass(
    classDeclaration: ts.ClassDeclaration
  ): MixinClassExpressionAndDeclarations {
    const { className, mixinInterfaceName } =
      this.getClassAndInterfaceNames(classDeclaration);

    const mixinClassExpression = ts.factory.createClassExpression(
      undefined,
      undefined,
      className,
      undefined,
      [
        ts.factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
          ts.factory.createExpressionWithTypeArguments(
            ts.factory.createIdentifier('Base'),
            []
          ),
        ]),
        ts.factory.createHeritageClause(ts.SyntaxKind.ImplementsKeyword, [
          ts.factory.createExpressionWithTypeArguments(
            ts.factory.createIdentifier(mixinInterfaceName),
            []
          ),
        ]),
      ],
      classDeclaration.members
    );

    const extendClause = ASTUtils.getExtendsClause(classDeclaration);
    const { mergeSuperClasses } = this.config;
    if (!!extendClause?.types?.length && mergeSuperClasses) {
      const { mixinClassExpression: exprs, generatedMixinDeclarations } =
        this.mergeSuperClassesIntoMixin(mixinClassExpression, classDeclaration);

      return {
        mixinClassExpression: exprs,
        generatedMixinDeclarations: generatedMixinDeclarations,
      };
    } else {
      return {
        mixinClassExpression,
        generatedMixinDeclarations: [],
      };
    }
  }

  private mergeSuperClassesIntoMixin(
    mixinClass: ts.ClassExpression,
    classDeclaration: ts.ClassDeclaration
  ): MixinClassExpressionAndDeclarations {
    const { classMergeStrategy, handlerDuplicateClassMember } = this.config;

    const mixinsOfSuperClasses =
      this.generateMixinsFromSuperClassesOf(classDeclaration);

    let mergedMixinClass = mixinClass;
    if (classMergeStrategy === 'inline') {
      // ? We inline the mixin class expression and the original class's super classes in two steps.
      // ? This is because of the prop override behavior.
      mergedMixinClass = this.InlineClasses(
        mixinClass,
        this.resolveSuperClassesOf(classDeclaration),
        handlerDuplicateClassMember
      );
    } else {
      for (const { mixinFunction, mixinInterface } of mixinsOfSuperClasses) {
        const mixinClassExprs =
          this.getMixinClassExpressionFromMixinFunctionDeclaration(
            mixinFunction
          );

        mergedMixinClass = ts.factory.updateClassExpression(
          mergedMixinClass,
          mergedMixinClass.decorators,
          mergedMixinClass.modifiers,
          mergedMixinClass.name,
          mergedMixinClass.typeParameters,
          mergedMixinClass.heritageClauses,
          [...mixinClassExprs.members, ...mergedMixinClass.members]
        );
      }
    }

    return {
      generatedMixinDeclarations: mixinsOfSuperClasses,
      mixinClassExpression: mergedMixinClass,
    };
  }

  private getMixinClassExpressionFromMixinFunctionDeclaration(
    mixinFunction: ts.FunctionDeclaration
  ): ts.ClassExpression {
    const returnStmtExprs = asNodeArray(mixinFunction.body.statements).find(
      ts.isReturnStatement
    ).expression;

    const mixinClassExprs =
      (ts.isAsExpression(returnStmtExprs) &&
        ts.isClassExpression(returnStmtExprs.expression) &&
        returnStmtExprs.expression) ||
      undefined;

    return mixinClassExprs;
  }

  private generateMixinsFromSuperClassesOf(
    classDeclaration: ts.ClassDeclaration
  ): CompleteMixinDeclaration[] {
    return this.resolveSuperClassesOf(classDeclaration).map(
      this.generateMixinFromClass.bind(this)
    );
  }

  private resolveSuperClassesOf(
    classDeclaration: ts.ClassDeclaration
  ): ts.ClassDeclaration[] {
    const extendsClause = ASTUtils.getExtendsClause(classDeclaration);
    const superClassTypes = asNodeArray(extendsClause.types);
    const resolvedSuperClasses = superClassTypes.map((type) => {
      let symbol = this.typeChecker.getSymbolAtLocation(type.expression);
      if (ts.isClassDeclaration(symbol.valueDeclaration)) {
        return symbol.valueDeclaration;
      } else {
        throw new Error(
          `Expected to find a class declaration but ${symbol.name} is not one.`
        );
      }
    });

    return resolvedSuperClasses;
  }

  private InlineClasses(
    mixinClass: ts.ClassExpression,
    resolvedSuperClasses: ts.ClassDeclaration[],
    handlerDuplicateClassMember: DuplicateHandlingStrategy
  ): ts.ClassExpression {
    if (!resolvedSuperClasses?.length) {
      return mixinClass;
    }

    const classToInline = resolvedSuperClasses[0];

    const isDuplicate = (
      mixinClass: ts.ClassExpression,
      member: ts.ClassElement
    ): boolean =>
      asNodeArray(mixinClass.members).some(
        (mixinMember) => mixinMember.name.getText() === member.name.getText()
      );

    for (const member of classToInline.members) {
      if (isDuplicate(mixinClass, member)) {
        if (handlerDuplicateClassMember === 'throw') {
          throw new Error(
            `A duplicate class member name: ${member.name.getText()} has been encountered
            while merging ${mixinClass.name.escapedText} with ${
              classToInline.name.escapedText
            }
            and the lib has been configured to throw in such an event.`
          );
        }
      }
    }
  }

  private createMixinBaseClassStatement(): ts.VariableStatement {
    return ts.factory.createVariableStatement(
      undefined,
      ts.factory.createVariableDeclarationList(
        [
          ts.factory.createVariableDeclaration(
            'Base',
            undefined,
            undefined,
            ts.factory.createAsExpression(
              ts.factory.createParenthesizedExpression(
                ts.factory.createBinaryExpression(
                  ts.factory.createIdentifier('base'),
                  ts.SyntaxKind.QuestionQuestionToken,
                  ts.factory.createClassExpression(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    []
                  )
                )
              ),
              this.createCtorTypeNode()
            )
          ),
        ],
        ts.NodeFlags.Const
      )
    );
  }

  private createCtorTypeNode(): ts.TypeReferenceNode {
    return ts.factory.createTypeReferenceNode('Constructor', [
      ts.factory.createTypeReferenceNode('any', []),
      ts.factory.createTypeReferenceNode('Array', [
        ts.factory.createTypeReferenceNode('any', []),
      ]),
    ]);
  }

  private getClassAndInterfaceNames(classDeclaration: ts.ClassDeclaration): {
    className: string;
    mixinInterfaceName: string;
  } {
    const className = classDeclaration.name.escapedText.toString();

    return { className, mixinInterfaceName: `I${className}` };
  }

  private createMixinInterfaceDeclaration(
    classDeclaration: ts.ClassDeclaration
  ): ts.InterfaceDeclaration {
    const { className, mixinInterfaceName } =
      this.getClassAndInterfaceNames(classDeclaration);
    const publicInstanceMembers =
      this.getPublicInstanceMembersOfClass(classDeclaration);
    const implementsClause = ASTUtils.getImplementsClause(classDeclaration);

    const interfaceFromOriginalClass = ts.factory.createInterfaceDeclaration(
      [],
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      mixinInterfaceName,
      [],
      [],
      publicInstanceMembers.map(this.mapClassMembersToSignatures)
    );

    if (!implementsClause?.types?.length) {
      // TODO: Here we should try to merge the base classes interfaces before returning
      return interfaceFromOriginalClass;
    }

    const implementedInterfaces = implementsClause.types;
  }

  private getPublicInstanceMembersOfClass(
    classDeclaration: ts.ClassDeclaration
  ): (ts.PropertyDeclaration | ts.MethodDeclaration)[] {
    const members = asNodeArray(classDeclaration.members);

    const publicMembers = members.filter(
      (classMember) =>
        !classMember.modifiers?.length ||
        asNodeArray(classMember.modifiers).some(
          (modifier) =>
            modifier.kind === ts.SyntaxKind.PublicKeyword ||
            (modifier.kind !== ts.SyntaxKind.PrivateKeyword &&
              modifier.kind !== ts.SyntaxKind.ProtectedKeyword)
        )
    );

    const publicInstanceMembers = publicMembers
      .filter((classMember) =>
        asNodeArray(classMember.modifiers).every(
          (modifier) => modifier.kind !== ts.SyntaxKind.StaticKeyword
        )
      )
      .filter(
        (member) =>
          ts.isMethodDeclaration(member) || ts.isPropertyDeclaration(member)
      )
      .map((member: ts.PropertyDeclaration | ts.MethodDeclaration) => {
        if (member.type) {
          return member;
        }

        if (ts.isPropertyDeclaration(member)) {
          const typeAtLoc = this.typeChecker.getTypeAtLocation(member);
          const typeName = this.typeChecker.typeToString(typeAtLoc);

          return ts.factory.updatePropertyDeclaration(
            member,
            member.decorators,
            member.modifiers,
            member.name,
            member.questionToken,
            ts.factory.createTypeReferenceNode(typeName, undefined),
            member.initializer
          );
        }

        // TODO: ITT lehetne method signature auto resolve-ot csinálni.
        // ? Tuti bajos lesz, de lehet érdemes bele időt tenni
        // else if (ts.isMethodDeclaration(member)) {

        //   const signature =
        //     this.typeChecker.getSignatureFromDeclaration(member);

        //   const typeAtLoc = this.typeChecker.getTypeAtLocation(member);
        //   const typeName = this.typeChecker.typeToString(typeAtLoc);

        //   return ts.factory.updateMethodDeclaration(
        //     member,
        //     member.decorators,
        //     member.modifiers,
        //     member.asteriskToken,
        //     member.name,
        //     member.questionToken,
        //     member.typeParameters,
        //     member.parameters,
        //     ts.factory.createTypeReferenceNode(
        //       this.typeChecker.getTypeAtLocation(member).getSymbol().getName(),
        //       undefined
        //     ),
        //     member.body
        //   );
        // }
        // else {
        //   throw new Error(
        //     `Expected a method or property declaration but got: ${member}`
        //   );
        // }

        return member;
      });

    return publicInstanceMembers;
  }

  private mapClassMembersToSignatures(
    declaration: ts.PropertyDeclaration | ts.MethodDeclaration
  ): ts.PropertySignature | ts.MethodSignature {
    if (ts.isPropertyDeclaration(declaration)) {
      return ts.factory.createPropertySignature(
        [],
        declaration.name,
        declaration.questionToken,
        declaration.type
      );
    }

    if (ts.isMethodDeclaration(declaration)) {
      return ts.factory.createMethodSignature(
        [],
        declaration.name,
        declaration.questionToken,
        declaration.typeParameters,
        declaration.parameters,
        declaration.type
      );
    }
  }
}
