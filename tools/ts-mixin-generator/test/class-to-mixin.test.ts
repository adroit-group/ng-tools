import { getTestSetup } from './helpers/test-setup';

describe('Transform class to mixin', () => {
  describe('Mixin Interface', () => {
    let transformedFile: string;

    beforeEach(() => {
      const { transformFile } = getTestSetup();
      transformedFile = transformFile('test-source.ts');
    });

    afterEach(() => {
      transformedFile = '';
    });

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
  });

  it('Should generate a mixin function from the converted class.', () => {
    const { transformFile } = getTestSetup();

    const transformedFile = transformFile('test-source.ts');

    const includesTheMixinFunction = transformedFile.includes(
      'export function AppComponentMixin<'
    );
    expect(includesTheMixinFunction).toBeTruthy();
  });
});
