import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { Images } from 'src/entity/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image])], // Registra el repositorio de Image
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
