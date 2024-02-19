
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Permissions } from 'src/enums/permissions.enum'
import { File } from 'src/files/files.model'
import { FilesService } from 'src/files/files.service'
import { AccessLink } from 'src/permissions/access-link.model'
import { UserPermission } from 'src/permissions/permissions.model'
import { UserPermissionsService } from 'src/permissions/permissions.service'
import { User } from 'src/users/users.model'
import * as uuid from 'uuid'

import { Folder } from './folders.model'

import type { CreateFolderDto } from './dto/create-folder.dto'
import type { EditFolderDto } from './dto/edit-folder.dto'
import type { GrantAccessDto } from 'src/permissions/dto/grant-access.dto'

const MAX_SAFE_FOLDER_LAYERS = 10

@Injectable()
export class FolderService {
  constructor(
    @InjectModel(Folder) private readonly folderRepository: typeof Folder,
    @InjectModel(File) private readonly fileRepository: typeof File,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(UserPermission) private readonly userFolderRepository: typeof UserPermission,
    @InjectModel(AccessLink) private readonly accessLinkRepository: typeof AccessLink,
    private readonly filesService: FilesService,
    private readonly permissionsService: UserPermissionsService,
    private readonly sequelize: Sequelize
  ) { }

  async getAll(userEmail: string) {
    const folders = []
    const { id } = await this.userRepository.findOne({ where: { email: userEmail } })
    const availableFolders = await this.permissionsService.getEntityWithAccess(
      id,
      [Permissions.VIEW, Permissions.EDIT, Permissions.CREATOR],
      Folder
    )

    const folderPromises = availableFolders.map(async item => {
      const folder = await this.loadSubfolders(item.id, MAX_SAFE_FOLDER_LAYERS, item.action)
      return { ...folder, permissions: item.permissions, action: item.action }
    })
    folders.push(...(await Promise.all(folderPromises)))

    return folders
  }

  async getOne(id: number) {
    const folder = await this.loadSubfolders(id, MAX_SAFE_FOLDER_LAYERS)
    return folder
  }

  async getShared(link: string) {
    const { linkedId } = await this.accessLinkRepository.findOne({ where: { link } })
    const folder = await this.loadSubfolders(linkedId, MAX_SAFE_FOLDER_LAYERS)

    return folder
  }

  async create(dto: CreateFolderDto) {
    const folder = await this.folderRepository.create({ ...dto })
    const parentFolder = await this.folderRepository.findByPk(dto.parentId, { include: { all: true } })
    parentFolder?.update({ folders: [...parentFolder.folders ?? [], folder] })
    const { id } = await this.userRepository.findOne({ where: { email: dto?.userEmail } })

    await this.permissionsService.grantAccess(folder.id, id, Permissions.CREATOR, 'folder')
    const accessLink = {
      link: uuid.v4(),
      access: Permissions.VIEW,
    }
    await this.accessLinkRepository.create({
      ...accessLink,
      linkedId: folder.id,
      linkedType: 'folders',
    })

    return folder
  }

  async clone(id: number, dto: CreateFolderDto) {
    const { parentId } = dto
    const clonedFolder = await this.cloneFolderWithSubfolders(id, parentId)

    const folder = await this.folderRepository.findOne({ where: { id: clonedFolder.id } })
    folder.update({ name: folder.name + ' - copy' })
    const nestedFolder = await this.loadSubfolders(clonedFolder.id, MAX_SAFE_FOLDER_LAYERS)
    nestedFolder.name += ' - copy'

    return nestedFolder
  }

  async update(id: number, dto: EditFolderDto) {
    const folder = await this.folderRepository.findOne({ where: { id } })
    folder.update({ ...dto })

    return folder
  }

  async delete(id: number) {
    return await this.sequelize.transaction(async transaction => {
      const deleteFolderRecursive = async (folderId: number) => {
        const folder = await this.folderRepository.findOne({
          where: { id: folderId },
          include: [{ model: Folder, as: 'folders' }, { model: File, as: 'files' }],
          transaction,
        })

        if (!folder) {
          return
        }

        await this.fileRepository.destroy({
          where: { id: folder.files.map(file => file.id) },
          transaction,
        })

        await this.userFolderRepository.destroy({
          where: { entityId: folder.id },
          transaction,
        })

        await this.accessLinkRepository.destroy({
          where: { linkedId: folder.id },
          transaction,
        })

        for (const childFolder of folder.folders) {
          await deleteFolderRecursive(childFolder.id)
        }

        await this.folderRepository.destroy({
          where: { id: folderId },
          transaction,
        })
      }

      await deleteFolderRecursive(id)
      return 'Folder and associated files deleted successfully'
    })
  }

  async managePermissions(folderId: number, dto: GrantAccessDto): Promise<string[]> {
    const errorMessages = await this.permissionsService.managePermissions(folderId, dto, 'folder')

    return errorMessages
  }

  async createFiles(parentId: number, uploadedFiles: Array<Express.Multer.File>, userEmail: string, isPublic: boolean) {
    const { id } = await this.userRepository.findOne({ where: { email: userEmail } })
    const files = await this.filesService.create(uploadedFiles, parentId, id, isPublic)
    const folder = await this.folderRepository.findByPk(parentId, { include: { all: true } })
    folder.files = [...folder.files ?? [], ...files]
    await folder.save()

    return folder
  }

  private async loadSubfolders(id: number, depth: number, action?: Permissions) {
    const folder = await this.folderRepository.findByPk(id, {
      include: [
        {
          model: Folder,
          as: 'folders',
        },
        {
          model: File,
          as: 'files',
          include: [
            {
              model: AccessLink,
              as: 'link',
              attributes: ['access', 'link', 'disabled', 'linkedType'],
            },
          ],
        },
        {
          model: AccessLink,
          as: 'link',
          attributes: ['access', 'link', 'disabled', 'linkedType'],
        },
      ],
    })

    if (!folder || depth <= 1) {
      return folder
    }

    const subfoldersPromises = folder.folders.map(subfolder =>
      this.loadSubfolders(subfolder.id, depth - 1, action)
    )
    const folders = await Promise.all(subfoldersPromises)

    return {
      id: folder.id,
      name: folder.name,
      parentId: folder.parentId,
      files: folder.files,
      link: folder.link,
      folders,
      action,
    }
  }

  private async cloneFolderWithSubfolders(id: number, parentId: number | null = null): Promise<Folder> {
    const originalFolder = await this.loadSubfolders(id, MAX_SAFE_FOLDER_LAYERS)
    const clonedFolder = this.cloneFolderObject(originalFolder)
    clonedFolder.parentId = parentId
    const createdClonedFolder = await this.folderRepository.create(clonedFolder)

    if (originalFolder.files && originalFolder.files.length > 0) {
      const clonedFilesPromises = originalFolder.files.map(async file => {
        return await this.filesService.clone(file.id, { parentId: clonedFolder.parentId })
      })
      const clonedFiles = await Promise.all(clonedFilesPromises)
      await createdClonedFolder.$add('files', clonedFiles)
    }

    if (originalFolder.folders && originalFolder.folders.length > 0) {
      await Promise.all(
        originalFolder.folders.map(async subfolder => {
          const clonedSubfolder = await this.cloneFolderWithSubfolders(subfolder.id, createdClonedFolder.id)
          await createdClonedFolder.$add('folders', clonedSubfolder)
        })
      )
    }

    return createdClonedFolder
  }

  private cloneFolderObject(folder: any) {
    const clonedFolder: any = {
      name: folder.name,
      parentId: folder.parentId,
    }

    if (folder.folders && folder.folders.length > 0) {
      clonedFolder.folders = folder.folders.map(subfolder => this.cloneFolderObject(subfolder))
    }

    return clonedFolder
  }
}
