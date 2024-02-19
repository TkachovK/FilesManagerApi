import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator'

export class EditFolderDto {
  @ApiProperty({ description: 'Name of the folder', example: 'My Folder' })
  @IsString({ message: 'Name must be a string' })
  readonly name: string

  @ApiProperty({
    description: 'Optional ID of the parent folder',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Parent ID must be an integer' })
  readonly parentId?: number

  @ApiProperty({
    description: 'Optional user email associated with the folder',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  readonly userEmail?: string
}
