import { Test, TestingModule } from '@nestjs/testing';
import { SportsService } from './service';
import { PrismaService } from '../prisma/service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AllowedGender } from '@prisma/client';

describe('SportsService', () => {
  let service: SportsService;
  let prisma: PrismaService;

  const mockPrisma = {
    sport: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<SportsService>(SportsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  const mockSport = {
    id: 'sport-uuid',
    name: 'Basketball',
    subscriptionPrice: 50.0,
    allowedGender: AllowedGender.male,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('create', () => {
    it('should create a sport successfully', async () => {
      mockPrisma.sport.create.mockResolvedValue(mockSport);

      const dto = {
        name: 'Basketball',
        subscriptionPrice: 50.0,
        allowedGender: AllowedGender.male,
      };

      const result = await service.create(dto);
      expect(prisma.sport.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(mockSport);
    });

    it('should throw ConflictException when sport name already exists', async () => {
      mockPrisma.sport.create.mockRejectedValue({ code: 'P2002' });

      const dto = {
        name: 'Basketball',
        subscriptionPrice: 50.0,
        allowedGender: AllowedGender.male,
      };

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all sports', async () => {
      mockPrisma.sport.findMany.mockResolvedValue([mockSport]);

      const result = await service.findAll();
      expect(prisma.sport.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual([mockSport]);
    });
  });

  describe('update', () => {
    it('should update a sport successfully', async () => {
      const dto = {
        name: 'Updated Basketball',
        subscriptionPrice: 60.0,
        allowedGender: AllowedGender.male,
      };

      mockPrisma.sport.update.mockResolvedValue({ ...mockSport, ...dto });

      const result = await service.update('sport-uuid', dto);
      expect(prisma.sport.update).toHaveBeenCalledWith({
        where: { id: 'sport-uuid' },
        data: dto,
      });
      expect(result.name).toBe('Updated Basketball');
    });

    it('should throw NotFoundException when sport does not exist', async () => {
      mockPrisma.sport.update.mockRejectedValue({ code: 'P2025' });

      await expect(service.update('not-found-id', {})).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when updating to an existing name', async () => {
      mockPrisma.sport.update.mockRejectedValue({ code: 'P2002' });

      await expect(service.update('sport-id', {})).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete a sport successfully', async () => {
      mockPrisma.sport.delete.mockResolvedValue(mockSport);

      const result = await service.remove('sport-uuid');
      expect(prisma.sport.delete).toHaveBeenCalledWith({ where: { id: 'sport-uuid' } });
      expect(result).toEqual(mockSport);
    });

    it('should throw NotFoundException when sport does not exist', async () => {
      mockPrisma.sport.delete.mockRejectedValue({ code: 'P2025' });

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
