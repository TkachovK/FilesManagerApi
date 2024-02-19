
import * as fs from 'node:fs'
import * as path from 'node:path'

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Permissions } from 'src/enums/permissions.enum'
import { AccessLink } from 'src/permissions/access-link.model'
import { UserPermissionsService } from 'src/permissions/permissions.service'
import { User } from 'src/users/users.model'
import * as uuid from 'uuid'

import { File } from './files.model'

import type { CloneFileDto } from './dto/clone-file.dto'
import type { CreateFileDto } from './dto/create-file.dto'
import type { Stream } from 'node:stream'
import type { GrantAccessDto } from 'src/permissions/dto/grant-access.dto'

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File) private fileRepository: typeof File,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(AccessLink) private readonly accessLinkRepository: typeof AccessLink,
    private readonly permissionsService: UserPermissionsService
  ) { }

  async getAvailable(userEmail: string) {
    const { id } = await this.userRepository.findOne({ where: { email: userEmail } })
    const availableFiles = await this.permissionsService.getEntityWithAccess(
      id,
      [Permissions.VIEW, Permissions.EDIT, Permissions.CREATOR],
      File
    )
    const publicFiles = await this.fileRepository.findAll({ where: { isPublic: true } })

    return [...availableFiles, ...publicFiles]
  }

  async getShared(link: string) {
    const { linkedId } = await this.accessLinkRepository.findOne({ where: { link } })
    const file = await this.fileRepository.findOne({ where: { id: linkedId } })

    return file
  }

  async create(uploadedFiles: Array<Express.Multer.File>, folderId: number, userId: number, isPublic: boolean) {
    const files = []
    try {
      uploadedFiles.forEach(async file => {
        const fileName = `${uuid.v4()}_${file.originalname}`
        const filePath = path.resolve(__dirname, '..', 'static')
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true })
        }
        fs.writeFileSync(path.join(filePath, fileName), file.buffer)
        files.push({ name: file.originalname, filePath: path.join(filePath, fileName), folderId, isPublic })
      })
    } catch (error) {
      throw new HttpException('An error happened during file uploading', HttpStatus.INTERNAL_SERVER_ERROR)
    }

    const createdFiles = await this.fileRepository.bulkCreate(files)
    createdFiles.forEach(async file => {
      await this.permissionsService.grantAccess(file.id, userId, Permissions.CREATOR, 'file')

      const accessLink = {
        link: uuid.v4(),
        access: Permissions.VIEW,
      }
      const { linkedId } = await this.accessLinkRepository.create({
        ...accessLink,
        linkedId: file.id,
        linkedType: 'files',
      })
      await file.update({ linkedId })
    })

    return createdFiles
  }

  async clone(id: number, dto: CloneFileDto) {
    const file = await this.fileRepository.findOne({ where: { id } })
    const readStream = fs.createReadStream(file.filePath)
    const fileName = `${uuid.v4()}_${file.name}`
    const filePath = path.resolve(__dirname, '..', 'static')
    const buffer = await this.stream2buffer(readStream)
    fs.writeFileSync(path.join(filePath, fileName), buffer)
    const clonedFile = await this.fileRepository.create({
      name: file.name + ' - copy',
      filePath: path.join(filePath, fileName),
      folderId: dto.parentId,
      isPublic: file.isPublic,
    })

    return clonedFile
  }

  async managePermissions(folderId: number, dto: GrantAccessDto): Promise<string[]> {
    const errorMessages = await this.permissionsService.managePermissions(folderId, dto, 'folder')

    return errorMessages
  }

  async rename(id: number, dto: CreateFileDto) {
    const file = await this.fileRepository.findOne({ where: { id } })
    file.update({ ...dto })
    return file
  }

  async delete(id: number) {
    await this.fileRepository.destroy({
      where: {
        id,
      },
    })
  }

  private async stream2buffer(stream: Stream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const _buf = Array<any>()

      stream.on('data', chunk => _buf.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(_buf)))
      stream.on('error', err => reject(`error converting stream - ${err}`))
    })
  }
}
