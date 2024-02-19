import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsEmail, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator'

class UsersPermissionsDto {
  @ApiProperty({ description: 'Action permission', enum: ['view', 'edit', 'creator'], example: 'view' })
  @IsString({ message: 'Action must be a string' })
  readonly action: string

  @ApiProperty({ description: 'User email associated with the permission', example: 'user@example.com' })
  @IsEmail({}, { message: 'Invalid email address' })
  readonly email: string
}

export class CreateFolderDto {
  @ApiProperty({ description: 'Name of the folder', example: 'My Folder' })
  @IsString({ message: 'Name must be a string' })
  readonly name: string

  @ApiPropertyOptional({
    description: 'Optional ID of the parent folder',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Parent ID must be an integer' })
  readonly parentId?: number

  @ApiPropertyOptional({
    description: 'Optional user email associated with the folder',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  readonly userEmail?: string

  @ApiPropertyOptional({
    type: [UsersPermissionsDto],
    description: 'Optional array of user permissions',
    example: [{ action: 'view', email: 'user@example.com' }],
  })
  @IsOptional()
  @IsArray({ message: 'Permissions must be an array' })
  @ValidateNested({ each: true })
  @Type(() => UsersPermissionsDto)
  readonly permissions?: UsersPermissionsDto[]
}
