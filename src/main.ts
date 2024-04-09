import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret:
        '649d3abd8561a36108de5c141cb48daef11eb9223a416357e838a9674b8147b8',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(helmet());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
