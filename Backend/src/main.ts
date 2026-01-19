import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS (correct for frontend-backend connection)
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  await app.listen(port);
  console.log(`✅ Backend running on http://localhost:${port}`);
}

bootstrap();
