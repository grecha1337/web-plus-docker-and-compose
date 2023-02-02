import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  NotFoundException,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { RequestWithUser } from '../types/req';
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  findOneCurrentUser(@Req() req: RequestWithUser) {
    const user = req.user;
    return this.usersService.findOne(user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  update(@Req() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Post('find')
  async findMany(@Body() body: { query: string }) {
    if (!body.query) {
      return [];
    }
    const user = await this.usersService.findMany(body.query);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  async findUser(@Param() params) {
    return await this.usersService.findByUsername(params.username);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async findMyWishes(@Req() req: RequestWithUser) {
    return await this.usersService.findMyWishes(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  async findWishesByUsername(@Param() params) {
    return await this.usersService.findWishesByUsername(params.username);
  }
}
