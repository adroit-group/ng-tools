import * as fs from 'fs';
import { cwd } from "process";
import { ITsMixinCliOpts } from '../utils';
import { findPackageJSON, getPackageJSONData } from "./get-package-data";


const PACKAGE_JSON_KEY = 'ts-mixin';


export function addConfigToPackageJson(opts: Partial<ITsMixinCliOpts>): void {
    const packageJSONPath = findPackageJSON();
    const packageJSONData = getPackageJSONData(packageJSONPath);
    let packageJsonConfigData: Partial<ITsMixinCliOpts> = packageJSONData[PACKAGE_JSON_KEY];

    if (!!packageJsonConfigData) {
        return;
    }

    packageJsonConfigData = { mode: opts.mode };
    if (!packageJsonConfigData?.path) {
        packageJsonConfigData.path = opts.path ?? cwd();
    }

    const updatedPackageJsonData = {
        ...packageJSONData,
        [PACKAGE_JSON_KEY]: packageJsonConfigData
    };

    fs.writeFileSync(packageJSONPath, JSON.stringify(updatedPackageJsonData, undefined, 2));
}
