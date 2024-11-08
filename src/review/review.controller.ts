import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { ReviewDto } from './dto/review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll() {
    return this.reviewService.getAll();
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('leave/:productId')
  @Auth()
  async leaveReview(
    @CurrentUser('id') id: number,
    @Body() dto: ReviewDto,
    @Param('productId') productId: string
  ) {
    return this.reviewService.create(id, dto, +productId);
  }
  @HttpCode(200)
  @Get('avarage/:productId')
  async getAvarageRating(@Param('productId') productId: string) {
    return this.reviewService.getAvarageValueByProductId(+productId);
  }
  @Get('average-by-product/:productId')
  async getAvarageByProduct(@Param('productId') productId: string) {
    return this.reviewService.getAvarageValueByProductId(+productId);
  }
}
