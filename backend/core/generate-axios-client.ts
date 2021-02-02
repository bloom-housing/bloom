import { codegen } from "swagger-axios-codegen"
import * as fs from "fs"

async function codeGen() {
  await codegen({
    methodNameMode: "operationId",
    remoteUrl: "http://localhost:3100/docs-json",
    outputDir: ".",
    useStaticMethod: false,
    fileName: "client.ts",
    useHeaderParameters: false,
    strictNullChecks: true,
  })
  let content = fs.readFileSync("./client.ts", "utf-8")
  content = content.replace(/(\w+)Dto/g, "$1")
  fs.writeFileSync("./client.ts", content)
}
void codeGen()
