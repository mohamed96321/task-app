import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    dto.password = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({ data: dto });
  }

  findAll(page = 1, limit = 10) {
    return this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        city: {
          include: { translations: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const u = await this.prisma.user.findUnique({
      where: { id },
      include: {
        city: {
          include: { translations: true },
        },
      },
    });
    if (!u) throw new NotFoundException();
    return u;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
