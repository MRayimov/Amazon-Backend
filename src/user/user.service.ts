import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { returnUserObject } from './return-user.object';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async byId(id: number, selectObject: Prisma.UserSelect = {}) {
    const user = this.prisma.user.findUnique({
      where: { id },
      select: {
        ...returnUserObject,
        favourites: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true
          }
        },
        ...selectObject
      }
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async updateProfile(id: number, dto: UserDto) {
    const isSameUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });
    if (isSameUser && id !== isSameUser.id) {
      throw new Error('User already exists');
    }
    const user = await this.byId(id);
    return this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        name: dto.name,
        avatarPath: dto.avatarPath,
        phone: dto.phone,
        password: dto.password ? await hash(dto.password) : user.password
      }
    });
  }
  async toggleFavourite(productId: number, userId: number) {
    const user = await this.byId(userId);
    if (!user) throw new NotFoundException('User not found!');

    const isExists = user.favourites.some(
      (product) => product.id === productId
    );
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        favourites: { [isExists ? 'disconnect' : 'connect']: { id: productId } }
      }
    });
    return { message: 'Success' };
  }
}
