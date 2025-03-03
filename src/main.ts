import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // Habilitar CORS y no tener problemas con las peticiones 
   app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // metodos que se van a usar en un futuro o actualmente para lo clasico de modificarciones de bd
    credentials: true, // para permitir las credenciales para la seguridad
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
