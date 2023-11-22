import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, Length } from "class-validator"

export class CreateUserDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'Email' })
  @IsEmail({}, { message: 'Should be valid email' })
  @IsString({ message: 'Should be string' })
  readonly email: string

  @ApiProperty({ example: '123456', description: 'Password' })
  @IsString({ message: 'Should be string' })
  @Length(5, 20, { message: 'Should be no less than 5 and no more than 20' })
  readonly password: string
}