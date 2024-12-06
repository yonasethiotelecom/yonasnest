import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrimPipe } from './common/pipes/trim-pipe';
import { ZodValidationPipe } from 'nestjs-zod';
import helmet from 'helmet';

const PORT = process.env.PORT ?? 4242;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:3000','*'],
    credentials: true,
  });

  app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

  app.useGlobalPipes(new ZodValidationPipe(), new TrimPipe());


 

  await app.listen(PORT);
}
bootstrap();
