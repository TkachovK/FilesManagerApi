import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { JwtAuthService } from './jwt/jwt-auth.service'

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtAuthService: JwtAuthService) { }

  async googleLogin(req: any, res: any) {
    const user = await this.userService.getUserByEmail(req.user.email)
    if (!user) {
      await this.userService.createUser(req.user)
    }

    const { accessToken } = this.jwtAuthService.login(req.user)
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    })

    return res.redirect(`${process.env.CLIENT_URL}/landing?token=${accessToken}`)
  }
}
