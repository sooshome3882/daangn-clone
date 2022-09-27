import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Admin } from '../entities/admin.entity';
import { AdminAuthority } from '../entities/adminAuthority.entity';
import { RoleType } from '../models/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const admin: Admin = ctx.getContext().req.user;
    return admin && admin.authorities && admin.authorities.some(role => roles.includes(role.authority));
  }
}
