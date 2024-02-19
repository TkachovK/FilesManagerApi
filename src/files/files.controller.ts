import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'
import { MultipleErrorsException } from 'src/exceptions/multiple-errors.exception'
import { GrantAccessDto } from 'src/permissions/dto/grant-access.dto'

import { CloneFileDto } from './dto/clone-file.dto'
import { CreateFileDto } from './dto/create-file.dto'
import { FilesService } from './files.service'

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) { }

  @Get()
  @ApiOperation({ summary: 'Get available files', description: 'Retrieve available files for a user' })
  @ApiQuery({ name: 'userEmail', description: 'User email to filter files', required: false })
  getAvailable(@Query('userEmail') userEmail: string) {
    return this.fileService.getAvailable(userEmail)
  }

  @Get('shared/:link')
  @ApiOperation({ summary: 'Get a shared file by link', description: 'Retrieve a shared file by its link' })
  @ApiParam({ name: 'link', description: 'Shared file link' })
  getShared(@Param('link') link: string) {
    return this.fileService.getShared(link)
  }

  @Post('clone/:id')
  @ApiOperation({ summary: 'Clone a file', description: 'Clone a file by its ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'File ID to clone' })
  @ApiBody({ type: CloneFileDto })
  clone(@Param('id') id: number, @Body() dto: CloneFileDto) {
    return this.fileService.clone(id, dto)
  }

  @Post('managePermissions/:id')
  @ApiOperation({ summary: 'Manage file permissions', description: 'Manage access permissions for a file' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiBody({ type: GrantAccessDto })
  async managePermissions(@Param('id') fileId: number, @Body() dto: GrantAccessDto) {
    const errors = await this.fileService.managePermissions(fileId, dto)

    if (errors.length > 0) {
      throw new MultipleErrorsException(errors)
    }

    return errors
  }

  @Put(':id')
  @ApiOperation({ summary: 'Rename a file', description: 'Rename a file by its ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiBody({ type: CreateFileDto })
  rename(@Param('id') id: number, @Body() dto: CreateFileDto) {
    return this.fileService.rename(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file by ID', description: 'Delete a file by its ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'File ID' })
  delete(@Param('id') id: number) {
    return this.fileService.delete(id)
  }
}
