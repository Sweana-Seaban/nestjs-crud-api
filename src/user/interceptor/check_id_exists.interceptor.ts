// check-id-exists.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  NotFoundException,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckIdExistsInterceptor implements NestInterceptor {
  constructor(private prismaService: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id);
    const entity = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    return next.handle().pipe(
      catchError((error) => {
        throw error;
      }),
    );
  }
}
