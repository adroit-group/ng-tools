import * as fs from 'fs';
import * as path from 'path';
import { getMixinName } from './get-mixin-name';

export function hasMixinAtPath(mixinDirPath: string, mixinName: string): boolean {
    if (!fs.existsSync(mixinDirPath)) {
        return false;
    }

    const mixinTypeDefFilePath = path.join(mixinDirPath, getMixinName(mixinName));
    return fs.existsSync(mixinTypeDefFilePath);
}