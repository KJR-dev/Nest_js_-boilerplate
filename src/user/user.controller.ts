import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Role } from '../generated/prisma/enums.js';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/UpdateUser.dto.js';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my profile (any authenticated user)' })
  async getMe(@CurrentUser() user: JwtPayload) {
    const fullUser = await this.userService.getUserById(user.id);
    if (!fullUser) return null;
    const { password, refreshToken, ...profile } = fullUser;
    return profile;
  }

  @Get('all')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users (ADMIN only)' })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Put('update/:id')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Update user (ADMIN and USER only)' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updateUser = await this.userService.updateUser(+id, updateUserDto);
    return {
      message: 'User updated successfully',
      user: updateUser,
    };
  }

  @Delete('destroy/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete user (ADMIN only)' })
  async deleteUser(@Param('id') id: string) {
    const deleteUser = await this.userService.deleteUser(+id);
    return {
      message: 'User deleted successfully',
      user: deleteUser,
    };
  }
}
