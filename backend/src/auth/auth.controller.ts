import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from '../guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req) {
    /* Генерируем для пользователя JWT токен */
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    //костыль потому что фронт передает свойство about как пустую строку
    if (!createUserDto.about) {
      createUserDto.about = 'Пока ничего не рассказал о себе';
    }
    /* При регистрации, создаём пользователя и генерируем для него токен */
    const user = await this.usersService.create(createUserDto);
    return this.authService.auth(user);
  }
}
