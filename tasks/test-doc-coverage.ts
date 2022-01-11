import * as child_process from 'child_process';
import * as colors from 'colors';
import * as fs from 'fs';
import * as path from 'path';

const documentationCoverageFile = '../doc-coverage.json';

const command =
  'npx compodoc $root --watch=false -p $tsConfig  --coverageTest=$globalThreshold';

function testDocCoverage() {
  try {
    console.log(colors.cyan(`Testing documentation coverage.`));
    let prevCoverage = 0;
    const docCoverageExists = fs.existsSync(documentationCoverageFile);
    if (!docCoverageExists) {
      console.log(
        colors.cyan(`
          It seems like this is either the first the the documentation coverage test is ran or the previous results were erased.\n
          The test script will generate ${path.join(
            __dirname,
            documentationCoverageFile
          )} with documentation coverage data.
        `)
      );
    }

    prevCoverage = docCoverageExists
      ? JSON.parse(
          fs.readFileSync(documentationCoverageFile, {
            encoding: 'utf-8',
          })
        ).coverage ?? 0
      : 0;

    const scriptToRun = command
      .replace('$root', 'libs/ng-utils')
      .replace('$tsConfig', './libs/ng-utils/tsconfig.compodoc.json')
      .replace('$globalThreshold', prevCoverage.toString());

    const coverageResult = child_process.execSync(scriptToRun).toString('utf8');

    const newCoverageStr = coverageResult
      .substring(
        coverageResult.indexOf('Documentation coverage'),
        coverageResult.indexOf('is over threshold')
      )
      .replace(/\D/g, '');

    const newCoverage = !isNaN(+newCoverageStr) ? +newCoverageStr : 0;

    if (newCoverage < prevCoverage) {
      console.error(
        colors.red(`
          Documentation coverage test failed!\n
          New coverage ${newCoverage}% is less than the previous ${prevCoverage}%.\n
          Did you forget to document the new code that your are trying to commit?
        `)
      );

      throw new Error();
    }

    console.log(
      colors.green(`
        Documentation coverage test passed with: ${newCoverage}% overall coverage.\n
        Previous coverage was: ${prevCoverage}%.
      `)
    );

    if (newCoverage === prevCoverage) {
      console.log(
        colors.cyan(
          `Documentation coverage did not change since last test. Skipping project data update.`
        )
      );
      return;
    }

    console.log(
      colors.cyan(`Updating project files with the new coverage data.`)
    );

    fs.writeFileSync(
      path.join(__dirname, documentationCoverageFile),
      JSON.stringify(
        {
          coverage: newCoverage,
        },
        undefined,
        2
      ),
      { encoding: 'utf8' }
    );

    console.log(colors.green(`Project data updated with new coverage.`));
  } catch (error) {
    console.error(error);

    return 1;
  }
}

testDocCoverage();
