import colors from 'colors';
import { Project } from 'ts-morph';
import ts from 'typescript';
import { ConfigurationManager } from '../src/converter/classes/config-manager';
import ClassToMixinTransformerFactory from '../src/converter/mixin-converter.transformer';

const project = new Project({
  tsConfigFilePath: './tsconfig.test.json',
});
const program = project.getProgram();

const configManager = new ConfigurationManager({});
const config = configManager.config;

const transformers = [
  new ClassToMixinTransformerFactory(program, config).getTransformerFactory(),
];

const compiler = program.compilerObject;
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

const sourceFiles = compiler
  .getSourceFiles()
  .filter((sf) => !sf.fileName.includes('node_modules'))
  .filter((sf) => sf.fileName.includes('test-source'));

for (const file of sourceFiles) {
  console.log(colors.cyan('original: \n'), file.getFullText(file));

  const result = ts.transform(
    file,
    transformers,
    compiler.getCompilerOptions()
  );

  const transformed = result.transformed[0];
  const deserializedAST = printer.printFile(transformed);

  console.log(deserializedAST);

  // fs.writeFileSync(file.fileName, deserializedAST);
}
