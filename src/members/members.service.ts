import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async create(createMemberDto: CreateMemberDto) {
    // Validate family head exists if provided
    if (createMemberDto.familyHeadId) {
      const familyHead = await this.prisma.member.findUnique({
        where: { id: createMemberDto.familyHeadId },
      });
      if (!familyHead) {
        throw new BadRequestException('Family head not found');
      }
    }

    return this.prisma.member.create({
      data: {
        ...createMemberDto,
        birthdate: new Date(createMemberDto.birthdate),
      },
      include: {
        familyHead: true,
        familyMembers: true,
        sportSubscriptions: {
          include: {
            sport: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        familyHead: true,
        familyMembers: true,
        sportSubscriptions: {
          include: {
            sport: true,
          },
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    // Validate family head exists if provided
    if (updateMemberDto.familyHeadId) {
      const familyHead = await this.prisma.member.findUnique({
        where: { id: updateMemberDto.familyHeadId },
      });
      if (!familyHead) {
        throw new BadRequestException('Family head not found');
      }
    }

    try {
      return await this.prisma.member.update({
        where: { id },
        data: {
          ...updateMemberDto,
          birthdate: updateMemberDto.birthdate
            ? new Date(updateMemberDto.birthdate)
            : undefined,
        },
        include: {
          familyHead: true,
          familyMembers: true,
          sportSubscriptions: {
            include: {
              sport: true,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Member not found');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.member.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Member not found');
      }
      throw error;
    }
  }
}
