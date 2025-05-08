import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageService } from './image.service';
import { join } from 'path';
import { Response } from 'express';
import { Images as ImageEntity } from 'src/entity/image.entity';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = Date.now() + '-' + file.originalname;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new Error('No se recibió ningún archivo');
      }

      const savedImage = await this.imageService.saveImage(
        file.filename,
        `uploads/${file.filename}`,
      );
      return { message: 'Imagen subida correctamente', image: savedImage };
    } catch (error) {
      console.error('Error en uploadFile:', error);
      throw new Error('Error interno del servidor: ' + error.message);
    }
  }

  @Get('uploads')
  async getAllImages(): Promise<any[]> {
    const images = await this.imageService.getAllImages();

    return images.map((img: ImageEntity) => ({
      id: img.id,
      filename: img.filename,
      plate: img.plate || this.imageService.extractPlateFromFilename(img.filename),
      date: img.createdAt,
      image: `http://3.23.102.253:3000/uploads/${img.filename}`,
    }));
  }

  @Get(':id')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const imageId = parseInt(id, 10);
    if (isNaN(imageId)) {
      return res.status(400).json({ message: 'ID inválido, debe ser un número' });
    }

    const image = await this.imageService.getImage(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    return res.sendFile(join(process.cwd(), image.path));
  }

  @Put(':id/plate')
  async updatePlate(@Param('id') id: string, @Body('plate') plate: string) {
    const imageId = parseInt(id, 10);
    if (isNaN(imageId)) {
      return { message: 'ID inválido' };
    }

    const updatedImage = await this.imageService.updatePlate(imageId, plate);
    return {
      message: 'Placa actualizada correctamente',
      image: updatedImage,
    };
  }
}
