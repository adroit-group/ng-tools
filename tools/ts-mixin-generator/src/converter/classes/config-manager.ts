import colors from 'colors';
import * as fs from 'fs';
import * as path from 'path';
import { cwd } from 'process';
import { EConfigTarget } from '../enums';
import { ITsMixinGeneratorConfig } from '../interfaces';

export class ConfigurationManager {
  private readonly defaultConfig: ITsMixinGeneratorConfig = {
    mergeSuperClasses: true,
    mergeInterfacesOfSuperClasses: true,
    mergeInterfacesOfOriginalClass: true,
    classMergeStrategy: 'extend',
    interfaceMergeStrategy: 'extend',
    handlerDuplicateClassMember: 'throw',
    handleDuplicateInterfaceMember: 'throw',
    inferMissingTypes: true,
    addMissingAccessModifiers: true,
    copyDocumentation: true,
    verbose: true,
  };

  public get config(): ITsMixinGeneratorConfig {
    if (!!this._config) {
      return this._config;
    }

    this._config = {
      ...this.defaultConfig,
      ...this.resolveConfig(),
      ...this.CliConfigParams,
    };

    return this._config;
  }

  private _config: ITsMixinGeneratorConfig;

  private readonly configTargetPrecedence = [
    EConfigTarget.CustomConfigJSON,
    EConfigTarget.PackageJSON,
  ];

  constructor(private readonly CliConfigParams: ITsMixinGeneratorConfig = {}) {}

  private resolveConfig(): ITsMixinGeneratorConfig {
    for (let i = 0; i < this.configTargetPrecedence.length; i++) {
      const configTarget = this.configTargetPrecedence[i];
      const configFileData = this.getConfigFileData(configTarget);
      if (!configFileData) {
        continue;
      }

      // ? package.json hold config under a certain key, while custom config file only holds our config.
      const tsMixinGeneratorConfig =
        configTarget !== EConfigTarget.CustomConfigJSON
          ? configFileData['tsmg'] ?? configFileData['ts-mixin-generator']
          : configFileData;

      if (!!tsMixinGeneratorConfig) {
        return tsMixinGeneratorConfig;
      }
    }

    console.log(
      colors.yellow(
        'TS Mixin Generator could not find any configuration. falling back to defaults.'
      )
    );

    return {};
  }

  private getConfigFileData(configTarget: EConfigTarget): Record<string, any> {
    const packageJsonPath = this.findConfigJsonFilePath(configTarget);
    if (!packageJsonPath) {
      return undefined;
    }

    const packageJSONData = fs.readFileSync(packageJsonPath, {
      encoding: 'utf-8',
    });
    return JSON.parse(packageJSONData);
  }

  private findConfigJsonFilePath(
    configTarget: EConfigTarget,
    dirPath: string = cwd()
  ): string {
    const currentDir = fs.readdirSync(dirPath);

    for (const dirEntryName of currentDir) {
      if (dirEntryName.includes(configTarget)) {
        return path.resolve(dirPath, dirEntryName);
      }
    }

    const parentDirPath = path.normalize(path.join(dirPath, '..'));
    if (parentDirPath === dirPath) {
      return undefined;
    }

    return this.findConfigJsonFilePath(configTarget, parentDirPath);
  }
}
