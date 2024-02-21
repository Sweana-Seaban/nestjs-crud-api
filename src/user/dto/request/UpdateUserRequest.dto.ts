import { OmitType, PartialType } from '@nestjs/swagger';
import { SignUpRequestDto } from 'src/auth/dto';
export class UpdateUserRequestDto extends PartialType(
  OmitType(SignUpRequestDto, ['isAdmin'] as const),
) {}
