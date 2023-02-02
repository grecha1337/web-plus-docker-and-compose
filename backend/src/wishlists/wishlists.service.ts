import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListsRepository: Repository<Wishlist>,

    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(userId: number, createWishlistDto: CreateWishlistDto) {
    const user = await this.usersService.findOne(userId);
    const wishes = await this.wishesService.findByIds(
      createWishlistDto.itemsId,
    );

    const wishList = this.wishListsRepository.create({
      ...createWishlistDto,
      owner: user,
    });
    const wishLisWithWish = {
      ...wishList,
      items: wishes,
    };
    return await this.wishListsRepository.save(wishLisWithWish);
  }

  async findAll() {
    return await this.wishListsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.wishListsRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async update(
    userId: number,
    wishListId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishList = await this.findOne(wishListId);
    if (wishList.owner.id !== userId) {
      throw new NotFoundException();
    }

    return await this.wishListsRepository.update(
      { id: wishListId },
      updateWishlistDto,
    );
  }

  async remove(userId: number, wishListId: number) {
    const wishList = await this.wishListsRepository.findOne({
      where: {
        owner: {
          id: userId,
        },
        id: wishListId,
      },
    });

    if (!wishList) {
      throw new NotFoundException();
    }

    return await this.wishListsRepository.delete({
      id: wishListId,
    });
  }
}
