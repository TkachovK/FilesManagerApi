import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'

export class CloneFileDto {
  @ApiProperty({ description: 'Optional ID of the parent folder', example: 1, required: false })
  @IsOptional()
  @IsInt({ message: 'Parent ID must be an integer' })
  readonly parentId?: number
}
