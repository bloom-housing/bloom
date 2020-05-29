import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let app
async function bootstrap() {
  app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001);
}
bootstrap();

export default app