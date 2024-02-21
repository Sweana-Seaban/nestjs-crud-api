import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInRequestDto } from './dto/request/SignInRequest.dto';
import { SignUpRequestDto } from './dto/request/SignUpRequest.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}
  async signup(signuprequestDto: SignUpRequestDto) {
    console.log(signuprequestDto, 'dto');

    //generate password hash
    const hash = await argon.hash(signuprequestDto.password);
    //save new user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: signuprequestDto.email,
          hash,
          isAdmin: signuprequestDto.isAdmin,
        },
      });
      console.log(user);
      delete user.hash;
      //return saved user
      return this.signToken(user.id, user.email, user.isAdmin);
    } catch (error) {
      //isolating error that came from prisma
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
      throw error;
    }
  }

  async signin(signinrequestDto: SignInRequestDto) {
    //find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: signinrequestDto.email,
      },
    });
    //if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials Incorrect');
    //compare password
    const pwMatches = await argon.verify(user.hash, signinrequestDto.password);
    //if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials Taken');
    //send back the user
    return this.signToken(user.id, user.email, user.isAdmin);
  }

  async signToken(
    userId: number,
    email: string,
    isAdmin: boolean,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email, isAdmin };
    const secret = this.configService.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return { access_token: token };
  }
}
