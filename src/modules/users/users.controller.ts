import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import * as userDto from 'src/interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: userDto.CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() req) {
    return this.userService.getMe(req.user);
  }
}
