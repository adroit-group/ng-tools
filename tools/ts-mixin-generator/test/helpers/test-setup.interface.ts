import { Program as TsMorphProgram, Project, ts } from 'ts-morph';
import { ITsMixinGeneratorConfig } from '../../src/converter/interfaces';

export interface ITSMixinTestSetup {
  project: Project;
  program: TsMorphProgram;
  config: ITsMixinGeneratorConfig;
  compiler: ts.Program;
  printer: ts.Printer;
  transformFileAST: (fileName: string) => ts.SourceFile;
  transformFile: (fileName: string) => string;
}
