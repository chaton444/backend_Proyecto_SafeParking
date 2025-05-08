import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '172.31.14.108',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'image_db',//nombre de la bd hecha en posgresql revisar el archivo de como crear tablas en posgresql
      autoLoadEntities: true,
      synchronize: true, // No usar en producción
    }),
    ImageModule,
  ],
})
export class AppModule {}
