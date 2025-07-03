import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from './service';
import { PrismaService } from '../prisma/service';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Gender, AllowedGender, SubscriptionType } from '@prisma/client';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let prisma: PrismaService;

  const mockPrisma = {
    member: {
      findUnique: jest.fn(),
    },
    sport: {
      findUnique: jest.fn(),
    },
    sportSubscription: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  const member = {
    id: 'member-id',
    gender: Gender.female,
  };

  const sport = {
    id: 'sport-id',
    allowedGender: AllowedGender.female,
  };

  const subscriptionData = {
    id: 'sub-id',
    memberId: 'member-id',
    sportId: 'sport-id',
    subscriptionType: SubscriptionType.group,
    member,
    sport,
  };

  describe('create', () => {
    it('should create a subscription successfully', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(member);
      mockPrisma.sport.findUnique.mockResolvedValue(sport);
      mockPrisma.sportSubscription.create.mockResolvedValue(subscriptionData);

      const dto = {
        memberId: 'member-id',
        sportId: 'sport-id',
        subscriptionType: SubscriptionType.group,
      };

      const result = await service.create(dto);
      expect(prisma.member.findUnique).toHaveBeenCalledWith({
        where: { id: 'member-id' },
      });
      expect(prisma.sport.findUnique).toHaveBeenCalledWith({
        where: { id: 'sport-id' },
      });
      expect(prisma.sportSubscription.create).toHaveBeenCalledWith({
        data: dto,
        include: { member: true, sport: true },
      });
      expect(result).toEqual(subscriptionData);
    });

    it('should throw NotFoundException when member does not exist', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          memberId: 'invalid-id',
          sportId: 'sport-id',
          subscriptionType: SubscriptionType.group,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when sport does not exist', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(member);
      mockPrisma.sport.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          memberId: 'member-id',
          sportId: 'invalid-sport',
          subscriptionType: SubscriptionType.group,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for gender mismatch', async () => {
      mockPrisma.member.findUnique.mockResolvedValue({
        ...member,
        gender: Gender.male,
      });
      mockPrisma.sport.findUnique.mockResolvedValue({
        ...sport,
        allowedGender: AllowedGender.female,
      });

      await expect(
        service.create({
          memberId: 'member-id',
          sportId: 'sport-id',
          subscriptionType: SubscriptionType.group,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException for duplicate subscription', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(member);
      mockPrisma.sport.findUnique.mockResolvedValue(sport);
      mockPrisma.sportSubscription.create.mockRejectedValue({ code: 'P2002' });

      await expect(
        service.create({
          memberId: 'member-id',
          sportId: 'sport-id',
          subscriptionType: SubscriptionType.group,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete a subscription successfully', async () => {
      mockPrisma.sportSubscription.delete.mockResolvedValue(subscriptionData);

      const result = await service.remove('sub-id');
      expect(prisma.sportSubscription.delete).toHaveBeenCalledWith({
        where: { id: 'sub-id' },
      });
      expect(result).toEqual(subscriptionData);
    });

    it('should throw NotFoundException when subscription does not exist', async () => {
      mockPrisma.sportSubscription.delete.mockRejectedValue({ code: 'P2025' });

      await expect(service.remove('not-exist')).rejects.toThrow(NotFoundException);
    });
  });
});
