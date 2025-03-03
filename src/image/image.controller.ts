import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageService } from './image.service';
import { join } from 'path';
import { Response } from 'express';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename = Date.now() + '-' + file.originalname;
        cb(null, filename);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log('Archivo recibido:', file); // Verifica si el archivo llega
      
      if (!file) {
        throw new Error('No se recibió ningún archivo'); // Lanza error si no hay archivo
      }
  
      const savedImage = await this.imageService.saveImage(file.filename, `uploads/${file.filename}`);
      return { message: 'Imagen subida correctamente', image: savedImage };
    } catch (error) {
      console.error('Error en uploadFile:', error);
      throw new Error('Error interno del servidor: ' + error.message);
    }
  }
  
  @Get(':id')
  async getImage(@Param('id') id: number, @Res() res: Response) {
    const image = await this.imageService.getImage(id);
    return res.sendFile(join(process.cwd(), image.path));
  }
}
