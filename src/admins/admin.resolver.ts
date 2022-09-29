import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatComplaints } from 'src/chats/chatComplaints.entity';
import { UserComplaints } from 'src/chats/userComplaints.entity';
import { PostComplaints } from 'src/posts/entities/postComplaints.entity';
import { AdminService } from './admin.service';
import { Roles } from './decorators/role.decorator';
import { AdminDto } from './dto/admin.dto';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import { SearchComplaintDto } from './dto/searchComplaint.dto';
import { Admin } from './entities/admin.entity';
import { JwtAdminAuthGuard } from './guards/jwtAdminAuth.guard';
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
  @UseGuards(JwtAdminAuthGuard, RolesGuard)
  @Roles(RoleType.ACCOUNT_CREATE)
  createAdmin(@Args('adminDto', AuthorityInputValidationPipe) adminDto: AdminDto): Promise<Admin> {
    return this.adminService.createAdmin(adminDto);
  }

  // 관라자 계정 수정
  @Mutation(() => Admin)
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAdminAuthGuard, RolesGuard)
  @Roles(RoleType.ACCOUNT_UPDATE)
  updateAdmin(@Args('adminDto', AuthorityInputValidationPipe) adminDto: AdminDto): Promise<Admin> {
    return this.adminService.updateAdmin(adminDto);
  }

  // 게시글 신고 목록 조회 및 검색
  @Query(() => [PostComplaints])
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAdminAuthGuard, RolesGuard)
  @Roles(RoleType.READ)
  getPostComplaints(@Args('searchComplaintDto') searchComplaintDto: SearchComplaintDto): Promise<PostComplaints[]> {
    return this.adminService.getPostComplaints(searchComplaintDto);
  }

  // 채팅 신고 목록 조회 및 검색
  @Query(() => [ChatComplaints])
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAdminAuthGuard, RolesGuard)
  @Roles(RoleType.READ)
  getChatComplaints(@Args('searchComplaintDto') searchComplaintDto: SearchComplaintDto): Promise<ChatComplaints[]> {
    return this.adminService.getChatComplaints(searchComplaintDto);
  }

  // 유저 신고 목록 조회 및 검색
  @Query(() => [UserComplaints])
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAdminAuthGuard, RolesGuard)
  @Roles(RoleType.READ)
  getUserComplaints(@Args('searchComplaintDto') searchComplaintDto: SearchComplaintDto): Promise<UserComplaints[]> {
    return this.adminService.getUserComplaints(searchComplaintDto);
  }
}
