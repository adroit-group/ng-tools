import * as fs from 'fs';
import * as path from 'path';
import { cwd } from 'process';

// import * as colors from 'colors';
function correctMixinTypes() {
  try {
    const libProjectConfPath = path.join(
      cwd(),
      'libs',
      'ng-utils',
      'project.json'
    );
    const libProjectConf = JSON.parse(
      fs.readFileSync(libProjectConfPath, { encoding: 'utf-8' })
    ) as Record<any, any>;

    const outputPaths = (libProjectConf?.targets?.build?.outputs ??
      []) as string[];
    if (!outputPaths.length) {
      throw new Error(`Lib output paths could not be found!`);
    }

    const primaryOutputPath = path.join(cwd(), outputPaths[0]);
    if (!fs.existsSync(primaryOutputPath)) {
      throw new Error(
        `Lib output at: ${primaryOutputPath} could not be found. Build the lib first.`
      );
    }

    const buildTypesDirPath = path.join(primaryOutputPath, 'lib', 'mixins');
    if (!fs.existsSync(buildTypesDirPath)) {
      throw new Error(
        `Lib types output at: ${primaryOutputPath} could not be found. Build the lib first.`
      );
    }

    for (const entry of fs.readdirSync(buildTypesDirPath)) {
      const entryPath = path.join(buildTypesDirPath, entry);
      const stats = fs.statSync(entryPath);
      if (!stats.isFile()) {
        continue;
      }

      if (!entry.endsWith('.ts')) {
        continue;
      }

      const fileContent = fs.readFileSync(entryPath, { encoding: 'utf-8' });
      const signOfMixinFunc = 'export declare function';
      if (!fileContent.includes(signOfMixinFunc)) {
        continue;
      }

      const indexTypePart = '[x: string]: any;';
      if (!fileContent.includes(indexTypePart)) {
        continue;
      }

      console.log(`Correcting: ${entryPath}`);
      const correctedFileContent = fileContent.replace(indexTypePart, '');
      fs.writeFileSync(entryPath, correctedFileContent, { encoding: 'utf-8' });
      console.log(`Successfully corrected: ${entryPath}`);
    }
  } catch (error) {
    console.error(error);

    return 1;
  }
}

correctMixinTypes();
