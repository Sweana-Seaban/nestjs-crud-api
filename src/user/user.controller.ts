import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtGuard } from 'src/auth/guard';
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  @Get('me')
  getMe(@GetUser('id') user: User) {
    return user;
  }

  @Patch()
  editUser() {}
}
