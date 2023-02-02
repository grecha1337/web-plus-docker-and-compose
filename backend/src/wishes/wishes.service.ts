import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtGuard } from '../guards/jwt.guard';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private dataSource: DataSource,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}

  @UseGuards(JwtGuard)
  async create(userId: number, createWishDto: CreateWishDto) {
    const user = await this.usersService.findOne(userId);
    return await this.wishesRepository.save({
      ...createWishDto,
      owner: user,
    });
  }

  async findWishesByUserId(userId: number): Promise<Wish[]> {
    return await this.wishesRepository.find({
      where: {
        owner: {
          id: userId,
        },
      },
      relations: {
        owner: true,
        offers: {
          user: true,
          item: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findWishesByUsername(username: string) {
    return await this.wishesRepository.find({
      where: {
        owner: {
          username: username,
        },
      },
      relations: {
        owner: true,
        offers: {
          user: true,
          item: true,
        },
      },
    });
  }

  async findOne(id: number) {
    return await this.wishesRepository.findOne({
      where: {
        id,
      },
      relations: {
        offers: {
          user: {
            wishlists: {
              owner: true,
              items: true,
            },
            wishes: true,
            offers: true,
          },
        },
        owner: true,
      },
    });
  }

  update(userId: number, wishId: number, updateWishDto: UpdateWishDto) {
    const wish = this.wishesRepository.findOne({
      where: {
        id: wishId,
        owner: {
          id: userId,
        },
      },
    });

    if (!wish) {
      throw new NotFoundException();
    }

    return this.wishesRepository.update({ id: wishId }, updateWishDto);
  }

  async remove(userId, wishId: number) {
    const wish = await this.wishesRepository.findOne({
      where: {
        owner: {
          id: userId,
        },
        id: wishId,
      },
    });

    if (!wish) {
      throw new NotFoundException();
    }

    return await this.wishesRepository.delete({
      id: wishId,
    });
  }

  async copy(userId: number, wishId: number) {
    const user = await this.usersService.findOne(userId);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const copyWish = await queryRunner.manager.findOne(Wish, {
      where: {
        id: wishId,
      },
      relations: {
        owner: true,
      },
    });
    const updateWish = { ...copyWish };
    updateWish.copied += 1;

    if (copyWish.owner.id === userId) {
      throw new BadRequestException();
    }
    copyWish.owner = user;
    copyWish.copied = 0;
    copyWish.raised = 0;

    let result = null;
    try {
      result = await queryRunner.manager.insert(Wish, copyWish);
      await queryRunner.manager.update(Wish, { id: wishId }, updateWish);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return result;
  }

  async updateRaised(wish: Wish, raised: number, manager: EntityManager) {
    return manager.update(Wish, { id: wish.id }, { raised });
  }

  async findTop(take = 10) {
    return await this.wishesRepository.find({
      relations: {
        offers: {
          user: {
            wishlists: {
              owner: true,
              items: true,
            },
            wishes: true,
            offers: true,
          },
        },
        owner: true,
      },
      order: {
        copied: 'DESC',
      },
      take,
    });
  }

  async findLast(take = 40) {
    return await this.wishesRepository.find({
      relations: {
        offers: {
          user: {
            wishlists: {
              owner: true,
              items: true,
            },
            wishes: true,
            offers: true,
          },
        },
        owner: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take,
    });
  }

  async findByIds(ids) {
    return await this.wishesRepository.findBy({ id: In(ids) });
  }
}
