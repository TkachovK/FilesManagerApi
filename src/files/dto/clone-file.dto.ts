import { IsOptional, IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CloneFileDto {
  @ApiProperty({ description: 'Optional ID of the parent folder', example: 1, required: false })
  @IsOptional()
  @IsInt({ message: 'Parent ID must be an integer' })
  readonly parentId?: number
}