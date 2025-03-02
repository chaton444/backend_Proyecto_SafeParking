import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from 'src/entity/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async saveImage(filename: string, path: string): Promise<Image> {
    const image = this.imageRepository.create({ filename, path });
    return this.imageRepository.save(image);
  }

  async getImage(id: number): Promise<Image> {
    const image = await this.imageRepository.findOne({where: {id}});
    if(!image){
     throw new Error('Imagen no encontrada en la bd');

    }
    return image;
  }
}
