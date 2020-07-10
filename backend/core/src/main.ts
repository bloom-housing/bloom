import { NestFactory } from "@nestjs/core"
import { applicationSetup, AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

async function bootstrap() {
  let app = await NestFactory.create(AppModule)
  app = applicationSetup(app)
  const options = new DocumentBuilder()
    .setTitle("Bloom API")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup("docs", app, document)
  await app.listen(process.env.PORT || 3001)
}
bootstrap()
