import { faker } from '@faker-js/faker';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { EnumProductSort, GetAllProductsDto } from './dto/get-all.product.dto';
import { ProductDto } from './dto/product.dto';
import {
  returnProductObject,
  returnProductObjectFullest
} from './return-product.object';
@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private paginationService: PaginationService
  ) {}
  async getAll(dto: GetAllProductsDto = {}) {
    const { sort, searchTerm } = dto;
    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];
    switch (sort) {
      case EnumProductSort.HIGH_PRICE:
        prismaSort.push({ price: 'desc' });
        break;
      case EnumProductSort.LOW_PRICE:
        prismaSort.push({ price: 'asc' });
        break;
      case EnumProductSort.OLDEST:
        prismaSort.push({ createdAt: 'asc' });
        break;
      case EnumProductSort.NEWEST:
        prismaSort.push({ createdAt: 'desc' });
        break;
      default:
        prismaSort.push({ createdAt: 'desc' });
    }
    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            },
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            }
          ]
        }
      : {};
    const { perPage, skip } = this.paginationService.getPagination(dto);

    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
      select: returnProductObject
    });

    return {
      products,
      length: products.length
    };
  }
  async byId(id: number) {
    const product = this.prisma.product.findUnique({
      where: { id },
      select: returnProductObjectFullest
    });
    if (!product) throw new NotFoundException('Product not found!');
    return product;
  }
  async bySlug(slug: string) {
    const product = this.prisma.product.findUnique({
      where: { slug },
      select: returnProductObjectFullest
    });
    if (!product) throw new NotFoundException('Product not found!');
    return product;
  }
  async byCategory(categorySlug: string) {
    const products = this.prisma.product.findMany({
      where: { category: { slug: categorySlug } },
      select: returnProductObjectFullest
    });
    if (!products) throw new NotFoundException('Products not found!');
    return products;
  }
  async getSimilar(id: number) {
    const currentProduct = await this.byId(id);

    if (!currentProduct)
      throw new NotFoundException('Current product not found!');

    const similarProducts = await this.prisma.product.findMany({
      where: {
        category: {
          name: currentProduct.name
        },
        NOT: {
          id: currentProduct.id
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: returnProductObject
    });
    return similarProducts;
  }
  async create() {
    const product = await this.prisma.product.create({
      data: {
        description: '',
        name: '',
        slug: '',
        price: 0
      }
    });
    return product.id;
  }
  async update(id: number, dto: ProductDto) {
    const { description, name, price, categoryId, images } = dto;
    const isExistCategory = this.prisma.category.findUnique({
      where: { id: categoryId }
    });
    if (!isExistCategory) throw new NotFoundException('Category not found!');
    return this.prisma.product.update({
      where: { id },
      data: {
        description,
        images,
        price,
        name,
        slug: faker.helpers.slugify(name).toLowerCase(),
        category: {
          connect: {
            id: categoryId
          }
        }
      }
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({
      where: { id }
    });
  }
}
