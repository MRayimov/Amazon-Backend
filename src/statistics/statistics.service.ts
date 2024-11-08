import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private userService: UserService
  ) {}

  async getMain(userId: number) {
    const user = await this.userService.byId(userId, {
      orders: {
        select: {
          items: true
        }
      },
      reviews: true
    });
    return [
      {
        name: 'Orders',
        values: user.orders.length
      },
      {
        name: 'Reviews',
        values: user.reviews.length
      },
      {
        name: 'Favourites',
        values: user.favourites.length
      }
    ];
  }
}
