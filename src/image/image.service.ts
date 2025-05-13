import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Images } from 'src/entity/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Images)
    private readonly imageRepository: Repository<Images>,
  ) {}

  async saveImage(filename: string, path: string): Promise<Images> {
    const plate = this.extractPlateFromFilename(filename);
    const image = this.imageRepository.create({ filename, path, plate });
    return this.imageRepository.save(image);
  }
  

  async getImage(id: number): Promise<Images> {
    const image = await this.imageRepository.findOne({ where: { id } });
    if (!image) {
      throw new Error('Imagen no encontrada en la bd');
    }
    return image;
  }

  async getAllImages(): Promise<Images[]> {
    return this.imageRepository.find();
  }



  extractPlateFromFilename(filename: string): string {
    const parts = filename.split('-');
    if (parts.length < 2) return 'DESCONOCIDA';
    const plateWithExtension = parts.slice(1).join('-');
    return plateWithExtension.replace(/\.[^/.]+$/, '');
  }
  async deleteImage(id: number): Promise<void> {
    const image = await this.getImage(id);
    await this.imageRepository.remove(image);
    return console.log('Imagen eliminada de la bd');
  }
  async updatePlate(id: number, newPlate: string): Promise<Images> {
    const image = await this.getImage(id);
    image.plate = newPlate;
    return this.imageRepository.save(image);
  }


}
