import { getTestSetup } from './test-setup';

const { transformFile } = getTestSetup();
const transformedFile = transformFile('test-source.ts');
console.log(transformedFile);
