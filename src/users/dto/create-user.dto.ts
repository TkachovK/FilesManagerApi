import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'Email' })
  @IsEmail({}, { message: 'Should be valid email' })
  @IsString({ message: 'Should be string' })
  readonly email: string
}
