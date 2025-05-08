import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageService } from './image.service';
import { join } from 'path';
import { Response } from 'express';
import { Image as ImageEntity } from 'src/entity/image.entity';

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

      // Extraer la placa del nombre del archivo
      const plate = this.extractPlateFromFilename(file.filename);

      // Guardar la imagen junto con la placa
      const savedImage = await this.imageService.saveImage(file.filename, `uploads/${file.filename}`);

      return { message: 'Imagen subida correctamente', image: savedImage };
    } catch (error) {
      console.error('Error en uploadFile:', error);
      throw new Error('Error interno del servidor: ' + error.message);
    }
  }

  // Método para extraer la placa del nombre del archivo
  private extractPlateFromFilename(filename: string): string {
    const regex = /([A-Z0-9]+-[A-Z0-9]+-[0-9]+-[0-9]+)/;  // Expresión regular para detectar la placa
    const match = filename.match(regex);
    return match ? match[0] : 'DESCONOCIDA';  // Si no encuentra placa, asigna 'DESCONOCIDA'
  }

  @Get('uploads')
  async getAllImages(): Promise<any[]> {
    const images = await this.imageService.getAllImages();

    return images.map((img: ImageEntity) => ({
      id: img.id,
      filename: img.filename,
      plate: this.extractPlateFromFilename(img.filename), // Extraemos la placa del nombre de archivo
      date: img.createdAt, // Usamos la fecha almacenada en createdAt
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
}
