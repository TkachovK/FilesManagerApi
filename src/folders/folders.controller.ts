import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'
import { MultipleErrorsException } from 'src/exceptions/multiple-errors.exception'
import { GrantAccessDto } from 'src/permissions/dto/grant-access.dto'

import { CreateFolderDto } from './dto/create-folder.dto'
import { EditFolderDto } from './dto/edit-folder.dto'
import { FolderService } from './folders.service'

@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) { }

  @Get()
  @ApiOperation({ summary: 'Get all folders', description: 'Retrieve all folders for a user' })
  @ApiQuery({ name: 'userEmail', description: 'User email to filter folders', required: false })
  getAll(@Query('userEmail') userEmail: string) {
    return this.folderService.getAll(userEmail)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a folder by ID', description: 'Retrieve a folder by its ID' })
  @ApiParam({ name: 'id', description: 'Folder ID' })
  getOne(@Param('id') folderId: number) {
    return this.folderService.getOne(folderId)
  }

  @Get('shared/:link')
  @ApiOperation({ summary: 'Get a shared folder by link', description: 'Retrieve a shared folder by its link' })
  @ApiParam({ name: 'link', description: 'Shared folder link' })
  getShared(@Param('link') link: string) {
    return this.folderService.getShared(link)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new folder', description: 'Create a new folder' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateFolderDto })
  create(@Body() dto: CreateFolderDto) {
    return this.folderService.create(dto)
  }

  @Post('clone/:id')
  @ApiOperation({ summary: 'Clone a folder', description: 'Clone a folder by its ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Folder ID to clone' })
  @ApiBody({ type: CreateFolderDto })
  clone(@Param('id') folderId: number, @Body() dto: CreateFolderDto) {
    return this.folderService.clone(folderId, dto)
  }

  @Post('managePermissions/:id')
  @ApiOperation({ summary: 'Manage folder permissions', description: 'Manage access permissions for a folder' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Folder ID' })
  @ApiBody({ type: GrantAccessDto })
  async managePermissions(@Param('id') folderId: number, @Body() dto: GrantAccessDto) {
    const errors = await this.folderService.managePermissions(folderId, dto)

    if (errors.length > 0) {
      throw new MultipleErrorsException(errors)
    }

    return errors
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a folder by ID', description: 'Update a folder by its ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Folder ID' })
  @ApiBody({ type: EditFolderDto })
  update(@Param('id') folderId: number, @Body() dto: EditFolderDto) {
    return this.folderService.update(folderId, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a folder by ID', description: 'Delete a folder by its ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Folder ID' })
  delete(@Param('id') folderId: number) {
    return this.folderService.delete(folderId)
  }

  @Post('filesUpload/:id')
  @ApiOperation({ summary: 'Upload files to a folder', description: 'Upload files to a folder by its ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Folder ID' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file'))
  createFiles(
    @Param('id') folderId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('isPublic') isPublic: boolean,
    @Body('userEmail') userEmail: string
  ) {
    return this.folderService.createFiles(folderId, files, userEmail, isPublic)
  }
}
