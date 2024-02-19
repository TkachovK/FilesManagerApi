import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation } from '@nestjs/swagger'
import { Response } from 'express'

import { AuthenticatedRequest, AuthService } from './auth.service'

@Controller('auth/google')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('')
  @ApiOperation({ summary: 'Initiate Google authentication', description: 'Initiate authentication with Google' })
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> { }

  @Get('redirect')
  @ApiOperation({
    summary: 'Handle Google authentication redirect',
    description: 'Handle the redirection after Google authentication',
  })
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response): Promise<void> {
    return this.authService.googleLogin(req, res)
  }
}
