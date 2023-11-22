import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation } from '@nestjs/swagger'

@Controller('auth/google')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  @ApiOperation({ summary: 'Initiate Google authentication', description: 'Initiate authentication with Google' })
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('redirect')
  @ApiOperation({ summary: 'Handle Google authentication redirect', description: 'Handle the redirection after Google authentication' })
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: any, @Res() res: any) {
    return this.authService.googleLogin(req, res);
  }
}