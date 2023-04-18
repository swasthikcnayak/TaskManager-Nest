import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AccessToken } from './dto/accessToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async singUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<String> {
    return this.authService.singUp(authCredentialsDto);
  }

  @Post('/signin')
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<AccessToken> {
    return this.authService.signIn(authCredentialsDto);
  }
}
