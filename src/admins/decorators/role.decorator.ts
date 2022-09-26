import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../models/role.enum';

export const Roles = (...roles: RoleType[]): any => SetMetadata('roles', roles);
