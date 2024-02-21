import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async delete(id: number) {
    try {
      await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      return 'User deleted';
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025')
          throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}
