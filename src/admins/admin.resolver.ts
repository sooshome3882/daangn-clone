import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import { Admin } from './entities/admin.entity';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Query(() => String)
  loginAdmin(@Args('loginAdminDto') loginAdminDto: LoginAdminDto): Promise<string> {
    return this.adminService.loginAdmin(loginAdminDto);
  }
}
