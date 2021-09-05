import * as colors from 'colors';
import * as fs from 'fs';
import * as path from "path";
import { cwd } from "process";
import { addConfigToPackageJson, getConfigFromPackageJson, getMixinName, hasMixinAtPath, populateTemplate } from "./actions";
import { ITsMixinCliOpts } from './utils/cli-opts';


export default function createMixin(opts: ITsMixinCliOpts) {
    if (opts.project) {
        addConfigToPackageJson(opts);
    }

    const packageJsonConfigData = getConfigFromPackageJson();
    const configuredPath = packageJsonConfigData?.path;
    const pathToUse = opts.path ?? configuredPath ?? cwd();
    console.log('pathToUse: ', pathToUse);
    const mixinFilesPathToUse = pathToUse === cwd() ? pathToUse : path.join(cwd(), opts.path);
    console.log('mixinFilesPathToUse: ', mixinFilesPathToUse);

    const forceMixinCreation = opts.force;
    const doesMixinAlreadyExists = hasMixinAtPath(mixinFilesPathToUse, opts.name);
    console.log(`Has mixin: ${opts.name} at path: ${mixinFilesPathToUse}`);
    if (doesMixinAlreadyExists && !forceMixinCreation) {
        console.log(colors.red(`Could not generate mixin with name: ${opts.name} as ${getMixinName(opts.name)} already exists at location: ${mixinFilesPathToUse}.`));
        return 1;
    }

    if (doesMixinAlreadyExists && forceMixinCreation) {
        console.log(colors.yellow(`Using force mode (-f) to overwrite already existing mixin: ${opts.name} at location: ${mixinFilesPathToUse}.`));
    }

    // const hasMixinTypeDef = hasMixinTypeDefAtPath(mixinFilesPathToUse);
    // const shouldSkipMixinTypeGeneration = opts.skip || packageJsonConfigData?.skip || hasMixinTypeDef;
    // console.log('Should skip type generation: ', shouldSkipMixinTypeGeneration);
    // if (!shouldSkipMixinTypeGeneration) {
    //     generateMixinTypes(mixinFilesPathToUse, opts.mode);
    // }

    const mixinTemplateFilePath = path.join(__dirname, 'templates', 'ts-mixin.template');
    console.log('template path: ', mixinTemplateFilePath);
    const tsMixinTemplate = fs.readFileSync(mixinTemplateFilePath, { encoding: 'utf-8' });
    const populatedTpl = populateTemplate(tsMixinTemplate, opts);

    fs.writeFileSync(
        path.join(mixinFilesPathToUse,
            `${opts.name}-mixin.ts`),
        populatedTpl,
        { encoding: 'utf-8', flag: 'w' }
    );

    console.log(colors.green(`Mixin ${opts.name} created at location: ${path.join(mixinFilesPathToUse, getMixinName(opts.name))}`));
}
