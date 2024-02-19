import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsEmail, IsString } from 'class-validator'

export class EmailActionDto {
  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  @IsEmail({}, { message: 'Invalid email address' })
  readonly email: string

  @ApiProperty({ description: 'Action to be performed', example: 'view' })
  @IsString({ message: 'Action must be a string' })
  readonly action: string
}

export class AccessLinkDto {
  @ApiProperty({ description: 'Access status', example: 'view' })
  @IsString({ message: 'Access must be a string' })
  readonly access: string

  @ApiProperty({ description: 'Link', example: 'http://localhost:3000/shared/folders/ba6c05a0-bff0-4bed-b329-f07c054164d2' })
  @IsString({ message: 'Link must be a string' })
  readonly link: string

  @ApiProperty({ description: 'Flag indicating if the link is disabled', example: false })
  @IsBoolean({ message: 'Disabled must be a boolean' })
  readonly disabled: boolean
}

export class GrantAccessDto {
  @ApiProperty({
    type: [EmailActionDto],
    description: 'List of email actions',
    example: [{ email: 'user@example.com', action: 'view' }],
  })
  @IsArray({ message: 'Email actions must be an array' })
  readonly emailActions: EmailActionDto[]

  @ApiProperty({
    type: AccessLinkDto,
    description: 'Access link information',
    example: {
      access: 'view',
      link: 'http://localhost:3000/shared/folders/ba6c05a0-bff0-4bed-b329-f07c054164d2',
      disabled: false,
    },
  })
  readonly accessLink: AccessLinkDto
}
