import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CitiesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCityDto) {
    return this.prisma.city.create({
      data: {
        region_id: dto.region_id,
        translations: { create: dto.translations },
      },
    });
  }

  findAll(p = 1, l = 10) {
    return this.prisma.city.findMany({
      skip: (p - 1) * l,
      take: l,
      include: { translations: true },
    });
  }

  async findOne(id: number) {
    const c = await this.prisma.city.findUnique({
      where: { city_id: id },
      include: { translations: true },
    });
    if (!c) throw new NotFoundException();
    return c;
  }

  async update(id: number, dto: UpdateCityDto) {
    await this.findOne(id);
    return this.prisma.city.update({
      where: { city_id: id },
      data: {
        region_id: dto.region_id,
        translations: {
          deleteMany: { city_id: id },
          create: dto.translations,
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.city.delete({ where: { city_id: id } });
  }
}
