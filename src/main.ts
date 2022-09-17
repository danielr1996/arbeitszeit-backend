import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {toTemporalInstant } from '@js-temporal/polyfill'
import {runMigrations} from "./migrations/migrations";
// @ts-ignore
Date.prototype.toTemporalInstant = toTemporalInstant

async function bootstrap() {
  await runMigrations()
  const app = await NestFactory.create(AppModule, {cors: true});
  const config = new DocumentBuilder()
      .setTitle('arbeitszeit-backend')
      .setDescription('The arbeitszeit API description')
      .setVersion('1.0')
      .addServer('http://localhost:3030')
      .addServer('https://arbeitszeitapi.app.danielr1996.de')
      .build();
  const document = await SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, document);
  await app.listen(3030);
}
bootstrap();
