import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  const config = new DocumentBuilder()
      .setTitle('arbeitszeit-backend')
      .setDescription('The arbeitszeit API description')
      .setVersion('1.0')
      .addServer('http://localhost:3030')
      .build();
  const document = await SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, document);
  await app.listen(3030);
}
bootstrap();
