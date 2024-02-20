import { Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { AdminGuard } from './guard';
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(AdminGuard)
  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }
}
