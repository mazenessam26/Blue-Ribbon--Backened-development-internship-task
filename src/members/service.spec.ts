import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { PrismaService } from '../prisma/service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Gender } from '@prisma/client';

describe('MembersService', () => {
  let service: MembersService;
  let prisma: PrismaService;

  const mockPrisma = {
    member: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  const mockMemberData = {
    id: 'uuid-123',
    firstName: 'John',
    lastName: 'Doe',
    gender: Gender.male,
    birthdate: new Date('2000-01-01'),
    subscriptionDate: new Date(),
    familyHeadId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    familyHead: null,
    familyMembers: [],
    sportSubscriptions: [],
  };

  describe('create', () => {
    it('should create a member successfully', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);
      mockPrisma.member.create.mockResolvedValue(mockMemberData);

      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        gender: Gender.male,
        birthdate: '2000-01-01',
      };

      const result = await service.create(dto);
      expect(prisma.member.create).toHaveBeenCalled();
      expect(result).toEqual(mockMemberData);
    });

    it('should throw BadRequestException when family head does not exist', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);

      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        gender: Gender.male,
        birthdate: '2000-01-01',
        familyHeadId: 'invalid-id',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(prisma.member.findUnique).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
      });
    });
  });

  

  describe('findOne', () => {
    it('should return a member with relations', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(mockMemberData);

      const result = await service.findOne('uuid-123');
      expect(prisma.member.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-123' },
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
      expect(result).toEqual(mockMemberData);
    });

    it('should throw NotFoundException when member does not exist', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

