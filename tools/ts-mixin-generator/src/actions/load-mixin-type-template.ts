import * as fs from 'fs';
import * as path from "path";
import { ETsMixinMode } from '../utils';

export function loadMixinTypeTemplate(mode: ETsMixinMode): string {
    const templateFilePath = path.join(__dirname, '../', 'templates', `${mode}.template`);
    return fs.readFileSync(templateFilePath, { encoding: 'utf-8' });
}