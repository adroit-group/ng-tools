import { getTestSetup } from './helpers/test-setup';

describe('Transform class to mixin', () => {
  let transformedFile: string;

  beforeEach(() => {
    const { transformFile } = getTestSetup();
    transformedFile = transformFile('test-source.ts');
  });

  afterEach(() => {
    transformedFile = '';
  });

  describe('Mixin Interface', () => {
    it('Should generate a mixin interface from the converted class.', () => {
      const includesTheMixinInterface = transformedFile.includes(
        'interface IAppComponent {'
      );
      expect(includesTheMixinInterface).toBeTruthy();
    });

    it('Mixin interface should have all the public properties and methods of the original class.', () => {
      const mixinInterfaceHasTitleProp = transformedFile.includes('title: ');
      const mixinInterfaceHasExplicitPublicPropOfComp =
        transformedFile.includes('explicitPublicPropOfComp:');
      const mixinInterfaceHasPublicGetterOfClass = transformedFile.includes(
        'publicGetterOfClass: '
      );
      const mixinInterfaceHasPublicMethodOfComp = transformedFile.includes(
        'publicMethodOfComp: '
      );

      expect(mixinInterfaceHasTitleProp).toBeTruthy();
      expect(mixinInterfaceHasExplicitPublicPropOfComp).toBeTruthy();
      expect(mixinInterfaceHasPublicGetterOfClass).toBeTruthy();
      expect(mixinInterfaceHasPublicMethodOfComp).toBeTruthy();
    });

    it('Should not have any private or protected members in the generated interface', () => {
      const mixinInterfaceHasPrivatePropertyOfComp = transformedFile.includes(
        'privatePropertyOfComp: '
      );
      const mixinInterfaceHasProtectedPropertyOfComp = transformedFile.includes(
        'protectedPropertyOfComp:'
      );
      const mixinInterfaceHasProtectedGetterOfComp = transformedFile.includes(
        'protectedGetterOfComp: '
      );
      const mixinInterfaceHasPrivateMethodOfComp = transformedFile.includes(
        'privateMethodOfComp: '
      );
      const mixinInterfaceHasProtectedMethodOfCom = transformedFile.includes(
        'protectedMethodOfCom: '
      );

      expect(mixinInterfaceHasPrivatePropertyOfComp).toBeFalsy();
      expect(mixinInterfaceHasProtectedPropertyOfComp).toBeFalsy();
      expect(mixinInterfaceHasProtectedGetterOfComp).toBeFalsy();
      expect(mixinInterfaceHasPrivateMethodOfComp).toBeFalsy();
      expect(mixinInterfaceHasProtectedMethodOfCom).toBeFalsy();
    });
  });

  describe('Mixin Function', () => {
    it('Should generate a mixin function from the converted class.', () => {
      const includesTheMixinFunction =
        transformedFile.includes('export function');
      expect(includesTheMixinFunction).toBeTruthy();
    });

    it('Should have the same name as the original class suffixed with Mixin', () => {
      const haveTheSameNAmeAsTheOriginalClassWithSuffix =
        transformedFile.includes(`function AppComponentMixin`);
      expect(haveTheSameNAmeAsTheOriginalClassWithSuffix).toBeTruthy();
    });

    it('Should have the appropriate function signature', () => {
      const hasTheAppropriateSignature = transformedFile.includes(
        `AppComponentMixin<T extends Constructor<any, Array<any>> = FunctionConstructor>(base?: T): MixinType<T, IAppComponent> {`
      );
      expect(hasTheAppropriateSignature).toBeTruthy();
    });

    it('Should have an assignment for base mixin class', () => {
      const hasMixinBaseClassAssignment = transformedFile.includes(
        `const Base = (base ?? class {})`
      );
      expect(hasMixinBaseClassAssignment).toBeTruthy();
    });

    it('Should return a class', () => {
      const returnsAClass = transformedFile.includes(`return class`);
      expect(returnsAClass).toBeTruthy();
    });
  });

  describe('Mixin class', () => {
    it('Should have the same name as the original class', () => {
      const haveTheSameNAmeAsTheOriginalClassWithSuffix =
        transformedFile.includes(`return class AppComponent`);
      expect(haveTheSameNAmeAsTheOriginalClassWithSuffix).toBeTruthy();
    });

    it('Should extend the base class assignment variable', () => {
      const extendsTheBaseClassAssignmentVariable =
        transformedFile.includes(`extends Base`);
      expect(extendsTheBaseClassAssignmentVariable).toBeTruthy();
    });

    it('Should implement the generated Mixin interface', () => {
      const implementsTheGeneratedMixinInterface = transformedFile.includes(
        `implements IAppComponent`
      );
      expect(implementsTheGeneratedMixinInterface).toBeTruthy();
    });

    it('Should have all the properties and methods of the original class', () => {
      const propertiesAndMethodsOfTheOriginalClass = [
        'title',
        'explicitPublicPropOfComp',
        'publicGetterOfClass',
        'privatePropertyOfComp',
        'protectedPropertyOfComp',
        'protectedGetterOfComp',
        'publicMethodOfComp',
        'privateMethodOfComp',
        'protectedMethodOfCom',
      ];

      for (const propertyName of propertiesAndMethodsOfTheOriginalClass) {
        const implementsTheGeneratedMixinInterface =
          transformedFile.includes(propertyName);
        expect(implementsTheGeneratedMixinInterface).toBeTruthy();
      }
    });
  });
});
