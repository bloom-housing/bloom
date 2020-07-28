import { codegen } from "swagger-axios-codegen"

codegen({
  methodNameMode: "operationId",
  remoteUrl: "http://localhost:3001/docs-json",
  outputDir: ".",
  useStaticMethod: true,
  fileName: "client.ts",
})
