import * as fs from 'fs';
import * as path from 'path';
import { ETsMixinMode } from '../utils';
import { loadMixinTypeTemplate } from './load-mixin-type-template';


export function generateMixinTypes(pathToUse: string, mode: ETsMixinMode): void {
    const mixinTypesTemplate = loadMixinTypeTemplate(mode);
    fs.mkdirSync(pathToUse, { recursive: true });
    fs.writeFileSync(
        path.join(pathToUse, 'mixin-type.ts'), 
        mixinTypesTemplate, 
        { encoding: 'utf-8', flag: 'w' }
    );
}