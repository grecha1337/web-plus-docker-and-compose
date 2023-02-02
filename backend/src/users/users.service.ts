import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private washesService: WishesService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password, ...res } = createUserDto;
    const hash = await bcrypt.hash(password, 10);
    if (await this.isExistUserByUsernameOrEmail(res.username, res.email)) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }

    return await this.usersRepository.save({ password: hash, ...res });
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
    });
    return user;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (
      updateUserDto.username &&
      updateUserDto.email &&
      (await this.isExistUserByUsernameOrEmail(
        updateUserDto.username,
        updateUserDto.email,
      ))
    ) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }

    if (updateUserDto.password) {
      const hash = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hash;
    }

    await this.usersRepository.update({ id }, updateUserDto);
    return await this.findOne(id);
  }

  async isExistUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<boolean> {
    const count = await this.usersRepository.count({
      where: [{ username }, { email }],
    });
    return !!count ? true : false;
  }

  async findMany(query: string) {
    return await this.usersRepository.find({
      where: [{ username: Like(`${query}%`) }, { email: Like(`${query}%`) }],
    });
  }

  async findMyWishes(id: number) {
    const wishes = await this.washesService.findWishesByUserId(id);
    return wishes;
  }

  async findWishesByUsername(username: string) {
    const wishes = await this.washesService.findWishesByUsername(username);
    return wishes;
  }
}
