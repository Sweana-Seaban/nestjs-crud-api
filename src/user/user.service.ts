import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserRequestDto } from './dto/request/UpdateUserRequest.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async delete(id: number) {
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return 'User deleted';
  }

  async edit(id: number, updateUserDetails: UpdateUserRequestDto) {
    console.log('Inside edit');
    console.log(updateUserDetails);
    let hash;
    if (updateUserDetails.password) {
      hash = await argon.hash(updateUserDetails.password);
    }

    console.log('inside hash');

    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: updateUserDetails?.email,
        hash: hash,
      },
    });
    console.log(updatedUser);

    return `User ${id} updated`;
  }
}
