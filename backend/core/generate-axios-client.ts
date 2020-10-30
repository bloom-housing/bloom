import { codegen } from "swagger-axios-codegen"

void codegen({
  methodNameMode: "operationId",
  remoteUrl: "http://localhost:3100/docs-json",
  outputDir: ".",
  useStaticMethod: false,
  fileName: "client.ts",
  useHeaderParameters: false,
})
