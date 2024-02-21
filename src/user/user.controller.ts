import { CheckIdExistsInterceptor } from './interceptor/check_id_exists.interceptor';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { AdminGuard } from './guard';

//every route requires a token
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

  @UseGuards(AdminGuard)
  @Delete(':id')
  @UseInterceptors(CheckIdExistsInterceptor)
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
