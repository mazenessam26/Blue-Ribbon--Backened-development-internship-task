import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/service';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';

@Injectable()
export class SportsService {
  constructor(private prisma: PrismaService) {}

  async create(createSportDto: CreateSportDto) {
    try {
      return await this.prisma.sport.create({
        data: createSportDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Sport with this name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.sport.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(id: string, updateSportDto: UpdateSportDto) {
    try {
      return await this.prisma.sport.update({
        where: { id },
        data: updateSportDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Sport not found');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Sport with this name already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.sport.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Sport not found');
      }
      throw error;
    }
  }
}
