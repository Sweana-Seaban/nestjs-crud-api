import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequestDto } from './dto/request/SignUpRequest.dto';
import { SignInRequestDto } from './dto/request/SignInRequest.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDetails: SignUpRequestDto) {
    console.log(signupDetails);

    return this.authService.signup(signupDetails);
  }

  @Post('signin')
  signin(@Body() signinDetails: SignInRequestDto) {
    return this.authService.signin(signinDetails);
  }
}
