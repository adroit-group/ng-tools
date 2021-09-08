import { Project } from 'ts-morph';
import ts from 'typescript';
import { ConfigurationManager } from '../../src/converter/classes/config-manager';
import { ITsMixinGeneratorConfig } from '../../src/converter/interfaces';
import ClassToMixinTransformerFactory from '../../src/converter/mixin-converter.transformer';
import { ITSMixinTestSetup } from './test-setup.interface';

export function getTestSetup(
  CliParams?: ITsMixinGeneratorConfig
): ITSMixinTestSetup {
  const project = new Project({
    tsConfigFilePath: './tsconfig.test.json',
  });

  const program = project.getProgram();

  const configManager = new ConfigurationManager(CliParams);
  const config = configManager.config;

  const transformers = [
    new ClassToMixinTransformerFactory(program, config).getTransformerFactory(),
  ];

  const compiler = program.compilerObject;
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  function transformFile(fileName: string): ts.SourceFile {
    const sourceFile = compiler
      .getSourceFiles()
      .filter((sf) => !sf.fileName.includes('node_modules'))
      .find((sf) => sf.fileName.includes(fileName));

    if (!ts.isSourceFile(sourceFile)) {
      throw new Error(`Could not find source file: ${fileName} for testing%`);
    }

    const result = ts.transform(
      sourceFile,
      transformers,
      compiler.getCompilerOptions()
    );

    return result.transformed[0];
  }

  // const sourceFiles = compiler
  //   .getSourceFiles()
  //   .filter((sf) => !sf.fileName.includes('node_modules'))
  //   .filter((sf) => sf.fileName.includes('test-source'));

  // for (const file of sourceFiles) {
  //   console.log(colors.cyan('original: \n'), file.getFullText(file));

  //   const result = ts.transform(
  //     file,
  //     transformers,
  //     compiler.getCompilerOptions()
  //   );

  //   const transformed = result.transformed[0];
  //   const deserializedAST = printer.printFile(transformed);

  //   console.log(deserializedAST);

  //   // fs.writeFileSync(file.fileName, deserializedAST);
  // }

  return {
    program,
    compiler,
    printer,
    project,
    config,
    transformFileAST: transformFile,
    transformFile: (filename: string) =>
      printer.printFile(transformFile(filename)),
  };
}
