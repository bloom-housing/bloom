import { codegen } from 'swagger-axios-codegen';
import * as fs from 'fs';
import 'dotenv/config';

async function codeGen() {
  await codegen({
    methodNameMode: 'operationId',
    remoteUrl: `http://localhost:${process.env.PORT}/api-json`,
    outputDir: 'types/src',
    useStaticMethod: false,
    fileName: 'backend-swagger.ts',
    useHeaderParameters: false,
    strictNullChecks: true,
  });
  let content = fs.readFileSync('./types/src/backend-swagger.ts', 'utf-8');
  content = content.replace(/(\w+)Dto/g, '$1');
  fs.writeFileSync('./types/src/backend-swagger.ts', content);
}
void codeGen();
