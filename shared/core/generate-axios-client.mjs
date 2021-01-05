import codegen from "swagger-axios-codegen"
import * as fs from "fs"

async function codeGen() {
  await codegen.codegen({
    methodNameMode: "operationId",
    remoteUrl: "http://localhost:3100/docs-json",
    outputDir: "src",
    useStaticMethod: false,
    fileName: "backend-swagger.ts",
    useHeaderParameters: false,
    strictNullChecks: true,
  })
  let content = fs.readFileSync("./src/backend-swagger.ts", "utf-8")
  content = content.replace(/(\w+)Dto/g, "$1")
  fs.writeFileSync("./src/backend-swagger.ts", content)
}
void codeGen()
