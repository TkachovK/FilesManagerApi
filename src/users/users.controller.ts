import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ValidationPipe } from 'src/pipes/validation.pipe'

import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'

import type { User } from './users.model'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Create new user', description: 'Create new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @UsePipes(ValidationPipe)
  create(@Body() userDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(userDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [CreateUserDto] })
  getUsers(): Promise<User[]> {
    return this.userService.getAllUsers()
  }
}
