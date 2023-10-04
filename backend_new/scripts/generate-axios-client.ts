import { codegen } from 'swagger-axios-codegen';
import * as fs from 'fs';
import 'dotenv/config';

async function codeGen() {
  await codegen({
    methodNameMode: 'operationId',
    remoteUrl: `http://localhost:${process.env.PORT}/api-json`,
    outputDir: '../shared-helpers/src/types',
    useStaticMethod: false,
    fileName: 'backend-swagger.ts',
    useHeaderParameters: false,
    strictNullChecks: true,
  });
  let content = fs.readFileSync(
    '../shared-helpers/src/types/backend-swagger.ts',
    'utf-8',
  );
  content = content.replace(/(\w+)Dto/g, '$1');
  fs.writeFileSync('../shared-helpers/src/types/backend-swagger.ts', content);
}
void codeGen();
