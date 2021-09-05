#!/usr/bin/env node
import { cwd } from 'process';
import * as yargs from 'yargs';
import createMixin from './main';
import { ITsMixinCliOpts } from './utils';

const tsMixinDocsSiteUrl = 'https://github.com/Adroit-Group/ng-tools';

const Yargs = yargs
  .usage(
    `Usage: $0 [-n name_string] [-p path_string] [-s summary_string] [-d description_string] [-r remarks_string] [-skip skip_boolean] [-project project_boolean]`
  )
  .option({
    name: {
      alias: 'n',
      description: 'The name of the mixin function that will be generated',
      demandOption: 'Specify the name of the mixin',
      requiresArg: true,
    },
    path: {
      alias: 'p',
      default: cwd(),
      description:
        'The path where the mixin files will be created. Defaults to cwd()',
    },
    force: {
      alias: 'f',
      default: false,
      description:
        'Force the creation of the mixin with the specified name ven if the configured path already contains a mixin with the same name.',
    },
    summary: {
      default: 'A simple mixin function generated by the TS-Mixin lib.',
      alias: 'sum',
    },
    description: {
      description:
        'The TS Doc summary of the mixin function that will be generated',
      default:
        'Such a mixin function is used to dynamically build prototype chains, thereby implementing a kind of class composition.',
      alias: 'desc',
    },
    remarks: {
      description:
        'The TS Doc remarks of the mixin function that will be generated',
      default:
        'Making a regular class extend a series of mixin functions works similarly to what you would expect from proper multiple inheritance, but in actuality it is less limited than that.',
      alias: 'rem',
    },
    skip: {
      default: false,
      description:
        'Whether or not to skip the mixin type creation. If set to true the mixin type file generation is skipped. Defaults to false.',
      boolean: true,
      alias: 's',
    },
    project: {
      default: true,
      boolean: true,
      description:
        'Specifies whether or not the ts-mixin script is run in an npm project. When the script is run in an npm project there will be configuration data added to package.json. Defaults to true.',
    },
  })
  .help()
  .epilog(`See documentation at: ${tsMixinDocsSiteUrl}`)
  .alias('h', 'help')
  .wrap(yargs.terminalWidth());

const argv = Yargs.argv as unknown as ITsMixinCliOpts;
createMixin(argv);
