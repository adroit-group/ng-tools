import * as fs from 'fs';
import * as path from 'path';
import { cwd } from 'process';

export function findPackageJSON(dirPath: string = cwd()): string {
    const currentDir = fs.readdirSync(dirPath);

    for (const dirEntryName of currentDir) {
        if (dirEntryName.includes('package.json')) {
            const dirEntryPath = path.resolve(dirPath, dirEntryName);
            return dirEntryPath;
        }
    }

    const parentDirPath = path.normalize(path.join(dirPath, '..'));
    return findPackageJSON(parentDirPath);
}

export function getPackageJSONData(packageJSONPath: string): Record<string, any> {
    const packageJSONData = fs.readFileSync(packageJSONPath, { encoding: 'utf-8' });
    return JSON.parse(packageJSONData);
}