import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Put,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /* Login, getNewTokens */
  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number) {
    return this.userService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('profile')
  async getNewTokens(@CurrentUser('id') id: number, @Body() dto: UserDto) {
    return this.userService.updateProfile(id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Patch('profile/favourites/:productId')
  async toggleFavourite(
    @CurrentUser('id') id: number,
    @Param('productId') productId: string
  ) {
    return this.userService.toggleFavourite(+productId, id);
  }
}
