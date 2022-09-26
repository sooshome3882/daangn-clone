import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Roles } from './decorators/role.decorator';
import { AdminDto } from './dto/admin.dto';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import { Admin } from './entities/admin.entity';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RoleType } from './models/role.enum';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Query(() => String)
  loginAdmin(@Args('loginAdminDto') loginAdminDto: LoginAdminDto): Promise<string> {
    return this.adminService.loginAdmin(loginAdminDto);
  }

  @Mutation(() => Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ACCOUNT_CREATE)
  createAdmin(@Args('adminDto') adminDto: AdminDto): Promise<Admin> {
    return this.adminService.createAdmin(adminDto);
  }

  @Mutation(() => Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ACCOUNT_UPDATE)
  updateAdmin(@Args('adminDto') adminDto: AdminDto): Promise<Admin> {
    return this.adminService.updateAdmin(adminDto);
  }
}
