import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { DataSource, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private dataSource: DataSource,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto) {
    const user = await this.usersService.findOne(userId);
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (user.id === wish.owner.id) {
      throw new ConflictException('Запрещено делать самодонат');
    }

    if (createOfferDto.amount > wish.price - wish.raised) {
      throw new ConflictException('Сумма доната превышает сумму сбора');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(Offer, {
        ...createOfferDto,
        user,
        item: wish,
      });
      await this.wishesService.updateRaised(
        wish,
        wish.raised + createOfferDto.amount,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return {};
  }

  async findAll() {
    return await this.offersRepository.find();
  }

  async findOne(id: number) {
    return await this.offersRepository.findOne({
      where: {
        id,
      },
    });
  }
}
