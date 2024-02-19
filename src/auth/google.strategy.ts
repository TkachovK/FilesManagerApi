import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-google-oauth20'

type User = {
  email: string,
  name: string,
  avatar: string,
  accessToken: string,
}
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<User> {
    const { name, emails, photos } = profile

    const user = {
      email: emails[0].value,
      name: name.givenName,
      avatar: photos[0].value,
      accessToken,
    }
    return user
  }
}
