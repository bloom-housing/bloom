import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

let app
async function bootstrap() {
  app = await NestFactory.create(AppModule)

  app.enableCors()
  const options = new DocumentBuilder().setTitle("Bloom API").setVersion("1.0").build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup("docs", app, document)

  await app.listen(process.env.PORT || 3001)
}
bootstrap()

export default app
