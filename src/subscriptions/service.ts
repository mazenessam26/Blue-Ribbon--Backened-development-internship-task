import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const { memberId, sportId, subscriptionType } = createSubscriptionDto;

    // Verify member exists
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Verify sport exists
    const sport = await this.prisma.sport.findUnique({
      where: { id: sportId },
    });
    if (!sport) {
      throw new NotFoundException('Sport not found');
    }

    // Check gender compatibility
    if (
      sport.allowedGender !== 'mix' &&
      sport.allowedGender !== member.gender
    ) {
      throw new BadRequestException(
        `This sport is only available for ${sport.allowedGender} members`,
      );
    }

    try {
      return await this.prisma.sportSubscription.create({
        data: {
          memberId,
          sportId,
          subscriptionType,
        },
        include: {
          member: true,
          sport: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Member is already subscribed to this sport',
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.sportSubscription.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Subscription not found');
      }
      throw error;
    }
  }
}
