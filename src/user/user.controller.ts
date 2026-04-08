import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Role } from '../generated/prisma/enums.js';
import { UserService } from './user.service';

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
}
