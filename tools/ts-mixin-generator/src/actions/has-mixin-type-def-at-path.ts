import * as fs from 'fs';
import * as path from 'path';

export function hasMixinTypeDefAtPath(mixinDirPath: string): boolean {
    if (!fs.existsSync(mixinDirPath)) {
        return false;
    }

    const mixinTypeDefFilePath = path.join(mixinDirPath, 'mixin-type.ts');
    return fs.existsSync(mixinTypeDefFilePath);
}