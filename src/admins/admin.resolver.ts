import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Roles } from './decorators/role.decorator';
import { AdminDto } from './dto/admin.dto';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import { Admin } from './entities/admin.entity';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { RolesGuard } from './guards/roles.guard';
import { RoleType } from './models/role.enum';
import { AuthorityInputValidationPipe } from './pipes/authority.pipe';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  // 관리자 로그인
  @Query(() => String)
  @UsePipes(ValidationPipe)
  loginAdmin(@Args('loginAdminDto') loginAdminDto: LoginAdminDto): Promise<string> {
    return this.adminService.loginAdmin(loginAdminDto);
  }

  // 관리자 계정 생성
  @Mutation(() => Admin)
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ACCOUNT_CREATE)
  createAdmin(@Args('adminDto', AuthorityInputValidationPipe) adminDto: AdminDto): Promise<Admin> {
    return this.adminService.createAdmin(adminDto);
  }

  // 관라자 계정 수정
  @Mutation(() => Admin)
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ACCOUNT_UPDATE)
  updateAdmin(@Args('adminDto', AuthorityInputValidationPipe) adminDto: AdminDto): Promise<Admin> {
    return this.adminService.updateAdmin(adminDto);
  }
}
