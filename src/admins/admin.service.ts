import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRepository } from './repositories/admin.repository';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import * as bcrypt from 'bcrypt';
import { AdminDto } from './dto/admin.dto';
import { Admin } from './entities/admin.entity';
import { AdminAuthorityRepository } from './repositories/adminAuthority.repository';
import { EntityManager, getConnection, getRepository } from 'typeorm';
import { PostComplaints } from 'src/posts/entities/postComplaints.entity';
import { PostComplaintsRepository } from 'src/posts/repositories/postComplaint.repository';
import { SearchComplaintDto } from './dto/searchComplaint.dto';
import { ChatComplaints } from 'src/chats/entities/chatComplaints.entity';
import { ChatComplaintsRepository } from 'src/chats/repositories/chatComplaints.repository';
import { UserComplaints } from 'src/chats/entities/userComplaints.entity';
import { UserComplaintsRepository } from 'src/chats/repositories/userComplaints.repository';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminRepository)
    private adminRepository: AdminRepository,
    @InjectRepository(AdminAuthorityRepository)
    private adminAuthorityRepository: AdminAuthorityRepository,
    @InjectRepository(PostComplaintsRepository)
    private postComplaintsRepository: PostComplaintsRepository,
    @InjectRepository(ChatComplaintsRepository)
    private chatComplaintsRepository: ChatComplaintsRepository,
    @InjectRepository(UserComplaintsRepository)
    private userComplaintsRepository: UserComplaintsRepository,
    private readonly jwtService: JwtService,
  ) {}

  async loginAdmin(loginAdminDto: LoginAdminDto): Promise<string> {
    /**
     * 관리자 로그인
     *
     * @author 허정연(golgol22)
     * @param {adminId, adminPw} 관리자아이다, 관리자 패스워드
     * @return {accessToken} 로그인되었을 때 토큰 발급
     * @throws {UnauthorizedException} 일치하는 관리자 정보를 찾지 못했을 때 예외처리
     */
    const { adminId, adminPw } = loginAdminDto;
    const found = await this.adminRepository.findOne(adminId);
    if (!found) {
      throw new UnauthorizedException('아이디나 패스워드가 일치하지 않습니다.');
    }
    const validatePassword = await bcrypt.compare(adminPw, found.adminPw);
    if (!validatePassword) {
      throw new UnauthorizedException('아이디나 패스워드가 일치하지 않습니다.');
    }
    const payload = { adminId };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  async createAdmin(adminDto: AdminDto): Promise<Admin> {
    /**
     * 관리자 계정 생성
     *
     * @author 허정연(golgol22)
     * @param {adminId, adminPw, authorities} 관리자아이다, 관리자 패스워드, 가지게 될 권한
     * @return {Admin} 생성된 관리자 계정
     * @throws {ConflictException} 생성할 아이디가 이미 사용 중일 때 예외처리
     */
    const { adminId, adminPw, authorities } = adminDto;
    const found = await this.adminRepository.findOne(adminId);
    if (found) {
      throw new ConflictException('사용중인 아이디입니다.');
    }
    const hashedAdminPw = await bcrypt.hash(adminPw, 10);
    await getConnection()
      .transaction(async (manager: EntityManager) => {
        await this.adminRepository.createAdmin(manager, adminId, hashedAdminPw);
        await this.adminAuthorityRepository.addAdminAuthorities(manager, adminId, authorities);
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('관리자 계정 생성에 실패하였습니다. 잠시후 다시 시도해주세요.');
      });
    return await this.adminRepository.getAdminById(adminId);
  }

  async updateAdmin(adminDto: AdminDto): Promise<Admin> {
    /**
     * 관리자 계정 수정
     *
     * @author 허정연(golgol22)
     * @param {adminId, adminPw, authorities} 관리자아이다, 관리자 패스워드, 가지게 될 권한
     * @return {Admin} 수정된 관리자 계정
     * @throws {NotFoundException} 수정하려고 하는 계정이 없는 아이디일 때 예외처리
     */
    const { adminId, adminPw, authorities } = adminDto;
    const found = await this.adminRepository.findOne(adminId);
    if (!found) {
      throw new NotFoundException('없는 아이디입니다.');
    }
    const hashedAdminPw = await bcrypt.hash(adminPw, 10);
    await getConnection()
      .transaction(async (manager: EntityManager) => {
        await this.adminRepository.updateAdmin(manager, adminId, hashedAdminPw);
        await this.adminAuthorityRepository.deleteAdminAuthorities(manager, adminId);
        await this.adminAuthorityRepository.addAdminAuthorities(manager, adminId, authorities);
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('관리자 계정 수정에 실패하였습니다. 잠시후 다시 시도해주세요.');
      });
    return await this.adminRepository.getAdminById(adminId);
  }

  async getPostComplaints(searchComplaintDto: SearchComplaintDto): Promise<PostComplaints[]> {
    /**
     * 게시글 신고목록 조회 및 검색
     *
     * @author 허정연(golgol22)
     * @param { complaintReason, processState, memo, perPage, page } 신고 이유, 처리상태, 메모, 페이지 당 보여줄 개수, 페이지
     * @return {PostComplaints[]} 게시글 신고목록
     */
    return await this.postComplaintsRepository.getPostComplaints(searchComplaintDto);
  }

  async getChatComplaints(searchComplaintDto: SearchComplaintDto): Promise<ChatComplaints[]> {
    /**
     * 채팅 신고목록 조회 및 검색
     *
     * @author 허정연(golgol22)
     * @param { complaintReason, processState, memo, perPage, page } 신고 이유, 처리상태, 메모, 페이지 당 보여줄 개수, 페이지
     * @return {ChatComplaints[]} 채팅 신고목록
     */
    return await this.chatComplaintsRepository.getChatComplaints(searchComplaintDto);
  }

  async getUserComplaints(searchComplaintDto: SearchComplaintDto): Promise<UserComplaints[]> {
    /**
     * 유저 신고목록 조회 및 검색
     *
     * @author 허정연(golgol22)
     * @param { complaintReason, processState, memo, perPage, page } 신고 이유, 처리상태, 메모, 페이지 당 보여줄 개수, 페이지
     * @return {ChatComplaints[]} 채팅 신고목록
     */
    return await this.userComplaintsRepository.getUserComplaints(searchComplaintDto);
  }

  // 1. "신고 검토 중"으로 업데이트
  async examinePostReport(complaintId: number): Promise<PostComplaints> {
    /**
     * 게시글 신고 검토
     *
     * @author 이승연(dltmddus1998)
     * @param {complaintId}
     * @return
     * @throws
     */
    const postComplaint = await this.postComplaintsRepository.getPostComplaintById(complaintId);
    if (!postComplaint) {
      throw new NotFoundException('존재하지 않는 신고 내용입니다.');
    }
    if (postComplaint.processState.processStateId === 2) {
      throw new BadRequestException('이미 신고 검토 중인 게시글입니다.');
    }
    await this.postComplaintsRepository.examinePostReport(complaintId);
    return await this.postComplaintsRepository.getPostComplaintById(complaintId);
  }

  async examineUserReport(complaintId: number): Promise<UserComplaints> {
    /**
     * 유저 신고 검토
     *
     * @author 이승연(dltmddus1998)
     * @param {complaintId}
     * @return {UserComplaints}
     * @throws {NotFoundException} 존재하지 않는 신고
     * @throws {BadRequestException} 이미 신고 검토 중
     */
    const userComplaint = await this.userComplaintsRepository.getUserComplaintById(complaintId);
    if (!userComplaint) {
      throw new NotFoundException('존재하지 않는 신고 내용입니다.');
    }
    if (userComplaint.processState.processStateId === 2) {
      throw new BadRequestException('이미 신고 검토 중인 유저입니다.');
    }
    await this.userComplaintsRepository.examineUserReport(complaintId);
    return await this.userComplaintsRepository.getUserComplaintById(complaintId);
  }

  async examineChatReport(complaintId: number) {
    /**
     * 채팅 신고 검토
     *
     * @author 이승연(dltmddus1998)
     * @param {complaintId}
     * @return {ChatComplaints}
     * @throws {NotFoundException} 존재하지 않는 신고
     * @throws {BadRequestException} 이미 신고 검토 중
     */
    const chatComplaint = await this.chatComplaintsRepository.getChatComplaintById(complaintId);
    if (!chatComplaint) {
      throw new NotFoundException('존재하지 않는 신고 내용입니다.');
    }
    if (chatComplaint.processState.processStateId === 2) {
      throw new BadRequestException('이미 신고 검토 중인 유저입니다.');
    }
    await this.chatComplaintsRepository.examineChatReport(complaintId);
    return this.chatComplaintsRepository.getChatComplaintById(complaintId);
  }

  // 2. 신고 검토 완료 허용 후 -> processState 4번으로 처리
  async dealPostReportBeforeThreeTimes(complaintId: number): Promise<PostComplaints> {
    /**
     * 1) 게시글 신고 검토 완료 허용 & 매너지수 감소 및 블라인드 처리 이후 신고 검토 완료 처리 (과거 신고 횟수가 3번 미만인 경우)
     * 2) 게시글 신고 검토 완료 허용 & 유저 이용정지 처리 및 블라인드 처리 이후 신고 검토 완료 처리 (과거 신고 횟수가 3번인 경우)
     *
     * @author 이승연(dltmddus1998)
     * @param {complaintId}
     * @return {PostComplaints}
     * @throws {NotFoundException} 존재하지 않는 신고
     * @throws {InternalServerErrorException} 신고 검토 완료 실패
     */
    const postComplaint = await this.postComplaintsRepository.getPostComplaintById(complaintId);
    if (!postComplaint) {
      throw new NotFoundException('존재하지 않는 신고 내용입니다.');
    }
    await getConnection()
      .transaction(async (manager: EntityManager) => {
        await this.postComplaintsRepository.completeReportHandlingOfPost(manager, complaintId);
        if (postComplaint.post.user.reportedTimes < 3 && postComplaint.post.user.reportedTimes >= 0) {
          await this.userComplaintsRepository.declineMannerTemp(manager, postComplaint.post.user.phoneNumber);
          await this.userComplaintsRepository.updateUserReportedTimes(manager, postComplaint.post.user.phoneNumber);
        } else if (postComplaint.post.user.reportedTimes === 3) {
          await this.userComplaintsRepository.updateUserSuspensionOfUse(manager, postComplaint.post.user.phoneNumber);
        }
        await this.postComplaintsRepository.updateBlindState(manager, complaintId);
        await this.postComplaintsRepository.afterCompleteReportHandlingOfPost(manager, complaintId);
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('게시글 신고 검토 완료에 실패하였습니다. 잠시후 다시 시도해주세요.');
      });
    return await this.postComplaintsRepository.getPostComplaintById(complaintId);
  }

  async dealUserReportBeforeThreeTimes(complaintId: number): Promise<UserComplaints> {
    /**
     * 1) 유저 신고 검토 완료 허용 & 매너지수 감소 및 블라인드 처리 이후 신고 검토 완료 처리 (과거 신고 횟수가 3번 미만인 경우)
     * 2) 유저 신고 검토 완료 허용 & 유저 이용정지 처리 및 블라인드 처리 이후 신고 검토 완료 처리 (과거 신고 횟수가 3번인 경우)
     *
     * @author 이승연(dltmddus1998)
     * @param {complaintId}
     * @return {UserComplaints}
     * @throws {NotFoundException} 존재하지 않는 신고
     * @throws {InternalServerErrorException} 신고 검토 완료 실패
     */
    const userComplaint = await this.userComplaintsRepository.getUserComplaintById(complaintId);
    if (!userComplaint) {
      throw new NotFoundException('존재하지 않는 신고 내용입니다.');
    }
    await getConnection()
      .transaction(async (manager: EntityManager) => {
        await this.userComplaintsRepository.completeReportHandlingOfUser(manager, complaintId);
        if (userComplaint.subjectUser.reportedTimes < 3 && userComplaint.subjectUser.reportedTimes >= 0) {
          await this.userComplaintsRepository.declineMannerTemp(manager, userComplaint.subjectUser.userName);
          await this.userComplaintsRepository.updateUserReportedTimes(manager, userComplaint.subjectUser.phoneNumber);
        } else if (userComplaint.subjectUser.reportedTimes === 3) {
          await this.userComplaintsRepository.updateUserSuspensionOfUse(manager, userComplaint.subjectUser.phoneNumber);
        }
        await this.userComplaintsRepository.updateBlindState(manager, complaintId);
        await this.userComplaintsRepository.afterCompleteReportHandlingOfUser(manager, complaintId);
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('유저 신고 검토 완료에 실패하였습니다. 잠시후 다시 시도해주세요');
      });
    return await this.userComplaintsRepository.getUserComplaintById(complaintId);
  }

  async dealChatReport(complaintId: number): Promise<ChatComplaints> {
    /**
     * 1) 채팅 신고 검토 완료 허용 & 매너지수 감소 및 블라인드 처리 이후 신고 검토 완료 처리 (과거 신고 횟수가 3번 미만인 경우)
     * 2) 채팅 신고 검토 완료 허용 & 유저 이용정지 처리 및 블라인드 처리 이후 신고 검토 완료 처리 (과거 신고 횟수가 3번인 경우)
     *
     * @author 이승연(dltmddus1998)
     * @param {complaintId}
     * @return {ChatComplaints}
     * @throws {NotFoundException} 존재하지 않는 신고
     * @throws {InternalServerErrorException} 신고 검토 완료 실패
     */
    const chatComplaint = await this.chatComplaintsRepository.getChatComplaintById(complaintId);
    if (!chatComplaint) {
      throw new NotFoundException('존재하지 않는 신고 내용입니다.');
    }
    if (chatComplaint.chat.user.reportedTimes < 3 && chatComplaint.chat.user.reportedTimes >= 0) {
      await getConnection()
        .transaction(async (manager: EntityManager) => {
          await this.chatComplaintsRepository.completeReportHandlingOfChat(manager, complaintId);
          if (chatComplaint.chat.user.reportedTimes < 3 && chatComplaint.chat.user.reportedTimes >= 0) {
            await this.userComplaintsRepository.declineMannerTemp(manager, chatComplaint.user.phoneNumber);
            await this.userComplaintsRepository.updateUserReportedTimes(manager, chatComplaint.user.phoneNumber);
          } else if (chatComplaint.chat.user.reportedTimes === 3) {
            await this.userComplaintsRepository.updateUserSuspensionOfUse(manager, chatComplaint.user.phoneNumber);
          }
          await this.chatComplaintsRepository.updateBlindState(manager, complaintId);
          await this.chatComplaintsRepository.afterCompleteReportHandlingOfChat(manager, complaintId);
        })
        .catch(err => {
          console.error(err);
          throw new InternalServerErrorException('채팅 신고 검토 완료에 실패하였습니다. 잠시후 다시 시도해주세요.');
        });
    }
    return await this.chatComplaintsRepository.getChatComplaintById(complaintId);
  }

  async getUsersInSuspensionOfUse(page: number, perPage: number) {
    /**
     * 이용정지자 목록 조회
     *
     * @author 이승연(dltmddus1998)
     * @param
     * @return
     */
    return await this.userComplaintsRepository.getUsersInSuspensionOfUse(page, perPage);
  }
}
