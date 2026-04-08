import { Role } from '../../generated/prisma/enums.js';

/**
 * Shape of the decoded JWT payload attached to request['user'].
 */
export interface JwtPayload {
  /** User primary key */
  id: number;
  /** User display name */
  name: string | null;
  /** User email */
  email: string;
  /** User role (ADMIN | USER | EDITOR | CONTRIBUTOR) */
  role: Role;
  /** Issued-at timestamp (set by JwtService) */
  iat?: number;
  /** Expiration timestamp (set by JwtService) */
  exp?: number;
}
