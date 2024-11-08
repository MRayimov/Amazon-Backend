import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewDto } from './dto/review.dto';
import { returnReviewObject } from './return-review.object';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.review.findMany({
      select: returnReviewObject,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
  async create(userId: number, dto: ReviewDto, productId: number) {
    return this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId
          }
        },
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
  }
  async getAvarageValueByProductId(productId: number) {
    return this.prisma.review
      .aggregate({
        where: { productId },
        _avg: { rating: true }
      })
      .then((data) => data._avg.rating);
  }
}
