import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class CreateFileDto {
  @ApiProperty({ description: 'Name of the file', example: 'example.txt' })
  @IsString({ message: 'Name must be a string' })
  readonly name: string

  @ApiProperty({ description: 'Optional ID of the folder to which the file belongs', example: 1, required: false })
  @IsOptional()
  @IsInt({ message: 'Folder ID must be an integer' })
  readonly folderId?: number
}
