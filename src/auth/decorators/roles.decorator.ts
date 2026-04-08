import { SetMetadata } from '@nestjs/common';
import { Role } from '../../generated/prisma/enums.js';

export const ROLES_KEY = 'roles';

/**
 * Declares which roles are allowed to access a route.
 * Example: @Roles(Role.ADMIN, Role.EDITOR)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
