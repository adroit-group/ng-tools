import * as fs from 'fs';
import * as path from 'path';
import { argv, cwd } from 'process';

// console.log(argv);

// argv[2] = '--folder=libs/ng-utils';

const cliArgs = argv.slice(2);

const folderArgRegex = /^-{1,2}f(older)?=/i;
const folderArg = cliArgs.find((argsWithVal) =>
  folderArgRegex.test(argsWithVal)
);

if (!folderArg) {
  console.error(
    `No lib folder specified. Make sure to add --folder to the script`
  );
  process.exit(1);
}

const folderToWorkIn = folderArg.split('=')[1];
const folderPath = path.join(cwd(), folderToWorkIn);
if (!fs.existsSync(folderPath)) {
  console.error(`The specified lib folder: (${folderPath}) doesn't exist`);
  process.exit(1);
}

const tsConfigArgRegex = /^-{1,2}((ts-?(config)?)|c(onfig)?)=/i;
const tsConfigArgArg = cliArgs.find((argsWithVal) =>
  tsConfigArgRegex.test(argsWithVal)
);

let tsConfigFileName: string;
if (!tsConfigArgArg) {
  console.warn(
    `No --ts-config argument specified. Using config file name: tsconfig.lib.json`
  );

  tsConfigFileName = 'tsconfig.lib.json';
} else {
  tsConfigFileName = tsConfigArgArg.split('=')[1];
}

const tsConfigPath = path.join(folderPath, tsConfigFileName);
if (!fs.existsSync(folderPath)) {
  console.error(
    `The specified ts configuration file: (${tsConfigPath}) does not exist`
  );
  process.exit(1);
}

const tsConfig = require(tsConfigPath) as Record<string, any>;

const configuredPaths = tsConfig['compilerOptions']['paths'] as Record<
  string,
  any
>;
if (typeof configuredPaths !== 'object') {
  console.error(
    `No path mappings configuration found in: ${tsConfigPath}. Are u specifying the right ts config file?`
  );
  process.exit(1);
}

const distFolderPath = path.join(cwd(), 'dist', folderToWorkIn);
if (!fs.existsSync(distFolderPath)) {
  console.error(`Cannot find dist folder: ${distFolderPath}`);
  process.exit(1);
}

rewritePathsRecursively(distFolderPath);

function rewritePathsRecursively(folderPath: string): void {
  const recognizedFileExtRegex = /\.?(js|ts)/i;
  const folder = fs.readdirSync(folderPath);

  for (const entry of folder) {
    const pathOfEntry = path.join(folderPath, entry);
    const isDir = fs.statSync(pathOfEntry).isDirectory();
    if (isDir) {
      rewritePathsRecursively(pathOfEntry);
    }

    const shouldRewrite = recognizedFileExtRegex.test(
      path.extname(pathOfEntry)
    );

    if (!shouldRewrite) {
      continue;
    }

    let fileContents = fs.readFileSync(pathOfEntry, { encoding: 'utf-8' });
    for (const alias in configuredPaths) {
      const mapping = configuredPaths[alias][0] as string;

      const aliasRegex = new RegExp(`('|")${alias}('|")`, 'g');

      let properMapping: string;
      const isFileInFesmFolder = folderPath.includes('fesm2015');
      if (isFileInFesmFolder) {
        properMapping = `"../esm2015/lib/${mapping.replace('./', '')}"`;
      } else {
        const isParentFolderLib = folderPath.endsWith('lib');

        properMapping = isParentFolderLib
          ? `"${mapping}"`
          : `"./lib/${mapping.replace('./', '')}"`;
      }

      fileContents = fileContents.replace(aliasRegex, properMapping);
    }

    fs.writeFileSync(pathOfEntry, fileContents, { encoding: 'utf-8' });
  }
}
