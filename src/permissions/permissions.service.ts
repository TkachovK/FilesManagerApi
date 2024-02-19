import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Permissions } from 'src/enums/permissions.enum'
import { Folder } from 'src/folders/folders.model'
import { User } from 'src/users/users.model'

import { AccessLink } from './access-link.model'
import { UserPermission } from './permissions.model'

import type { GrantAccessDto } from './dto/grant-access.dto'
import type { File } from 'src/files/files.model'

@Injectable()
export class UserPermissionsService {
  constructor(
    @InjectModel(UserPermission) private readonly userPermissionsRepository: typeof UserPermission,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(AccessLink) private readonly accessLinkRepository: typeof AccessLink
  ) { }

  async grantAccess(
    entityId: number, userId: number, permissions: Permissions, entityType: 'folder' | 'file'
  ): Promise<void> {
    const userPermission = await this.userPermissionsRepository.findOne({ where: { entityId, userId, entityType } })

    userPermission
      ? await userPermission.update({ permissions, entityType })
      : await this.userPermissionsRepository.create({ entityId, userId, permissions, entityType })
  }

  async removeAccess(entityId: number, userId: number): Promise<void> {
    const userPermission = await this.userPermissionsRepository.findOne({ where: { entityId, userId } })

    await userPermission.destroy()
  }

  async getEntityWithAccess(userId: number, permissions: Permissions[], model: typeof Folder | typeof File) {
    const isModelFolder = model === Folder
    const creatorPermissions = await this.userPermissionsRepository.findAll({
      where: {
        userId,
        permissions: Permissions.CREATOR,
        entityType: isModelFolder ? 'folder' : 'file',
      },
      include: [
        {
          model,
          attributes: isModelFolder ? ['id'] : ['id', 'name', 'filePath'],
          where: isModelFolder ? { parentId: null } : { folderId: null },
        },
      ],
    })

    const accessedPermissions = await this.userPermissionsRepository.findAll({
      where: {
        userId,
        permissions: {
          [Op.or]: [Permissions.VIEW, Permissions.EDIT],
        },
        entityType: isModelFolder ? 'folder' : 'file',
      },
      include: [
        {
          model,
          attributes: isModelFolder ? ['id'] : ['id', 'name', 'filePath'],
        },
      ],
    })

    const userPermissions = [...creatorPermissions, ...accessedPermissions]
    const ids = userPermissions.map(permission => permission.entityId)
    const entityPermissions = await this.userPermissionsRepository.findAll({
      where: {
        entityId: ids,
        permissions,
        entityType: isModelFolder ? 'folder' : 'file',
      },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    })

    const entities = userPermissions.map(permission => ({
      id: permission.entityId,
      permissions: entityPermissions
        .filter(item => item.entityId === permission.entityId)
        .map(filteredItem => ({
          action: filteredItem.permissions,
          email: filteredItem.user.email,
          avatar: filteredItem.user.avatar,
        })),
      action: permission.permissions,
      name: permission.file?.name ?? '',
      filePath: permission.file?.filePath ?? '',
    }))

    return entities
  }

  async managePermissions(entityId: number, dto: GrantAccessDto, entityType: 'folder' | 'file'): Promise<string[]> {
    const errorMessages: string[] = []
    const folders = await this.userPermissionsRepository.findAll({ where: { entityId } })

    const userPromises = dto?.emailActions?.map(async ({ email, action }) => {
      const user = await this.userRepository.findOne({ where: { email } })
      if (!user) {
        errorMessages.push(`User with email ${email} not found`)
        return null
      }

      const permission: Permissions = Permissions[action.toUpperCase() as keyof Permissions]
      await this.grantAccess(entityId, user.id, permission, entityType)

      return user
    })

    const users = await Promise.all(userPromises)
    const deletedPermissions = folders.filter(obj1 => !users.find(obj2 => obj1.userId === obj2?.id))
    const removeAccessPromises = deletedPermissions.map(async ({ userId }) => {
      await this.removeAccess(entityId, userId)
    })
    await Promise.all(removeAccessPromises)

    const accessLink = await this.accessLinkRepository.findOne({ where: { linkedId: entityId } })
    await accessLink.update({ ...dto.accessLink })

    return errorMessages
  }
}
