/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateRegionDto) {
    return this.prisma.region.create({
      data: {
        capital_city_id: dto.capital_city_id,
        code: dto.code,
        population: dto.population,
        translations: { create: dto.translations },
      },
    });
  }

  findAll(p = 1, l = 10) {
    return this.prisma.region.findMany({
      skip: (p - 1) * l,
      take: l,
      include: {
        translations: true,
        cities: true,
      },
    });
  }

  async findOne(id: number) {
    const r = await this.prisma.region.findUnique({
      where: { region_id: id },
      include: {
        translations: true,
        cities: true,
      },
    });
    if (!r) throw new NotFoundException();
    return r;
  }

  async update(id: number, dto: UpdateRegionDto) {
    await this.findOne(id);
    return this.prisma.region.update({
      where: { region_id: id },
      data: {
        capital_city_id: dto.capital_city_id,
        code: dto.code,
        population: dto.population,
        translations: {
          deleteMany: { region_id: id },
          create: dto.translations,
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.region.delete({ where: { region_id: id } });
  }
}
