import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'image_user',//credenciales de posgresql
      password: 'password123',//credenciales de posgresql
      database: 'image_db',//nombre de la bd hecha en posgresql revisar el archivo de como crear tablas en posgresql
      autoLoadEntities: true,
      synchronize: true, // No usar en producción
    }),
    ImageModule,
  ],
})
export class AppModule {}
