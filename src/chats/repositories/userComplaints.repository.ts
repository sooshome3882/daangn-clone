import { EntityRepository, Repository, getRepository, EntityManager } from 'typeorm';
import { SearchComplaintDto } from 'src/admins/dto/searchComplaint.dto';
import { UserComplaints } from '../entities/userComplaints.entity';
import { User } from 'src/users/entities/user.entity';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

@EntityRepository(UserComplaints)
export class UserComplaintsRepository extends Repository<UserComplaints> {
  getUserComplaints(searchComplaintDto: SearchComplaintDto) {
    const { complaintReason, processState, memo, perPage, page } = searchComplaintDto;
    const queryBuilder = this.createQueryBuilder('userComplaints')
      .innerJoinAndSelect('userComplaints.complaintUser', 'complaintUser')
      .innerJoinAndSelect('userComplaints.subjectUser', 'subjectUser')
      .innerJoinAndSelect('userComplaints.complaintReason', 'complaintReason')
      .innerJoinAndSelect('userComplaints.processState', 'processState')
      .orderBy('userComplaints.createdAt', 'DESC')
      .offset((page - 1) * perPage)
      .limit(perPage);
    if (complaintReason) queryBuilder.andWhere('complaintReason.complaintReasonId = :complaintReason', { complaintReason });
    if (processState) queryBuilder.andWhere('processState.processStateId = :processState', { processState });
    if (memo) queryBuilder.andWhere('memo like :memo', { memo: `%${memo}%` });
    return queryBuilder.getMany();
  }

  async getUserComplaintById(complaintId: number) {
    return await this.findOne(complaintId);
  }

  async examineUserReport(complaintId: number) {
    return await getRepository(UserComplaints)
      .findOne(complaintId)
      .then(userComplaint => {
        userComplaint.processState.processStateId = 2;
        userComplaint.save();
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('신고 접수 다음 단계로 넘어가지 않았습니다. 잠시후 다시 시도해주세요.');
      });
  }

  async completeReportHandlingOfUser(manager: EntityManager, complaintId: number) {
    return await manager
      .getRepository(UserComplaints)
      .findOne(complaintId)
      .then(userComplaint => {
        userComplaint.processState.processStateId = 3;
        userComplaint.save();
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('신고 검토가 제대로 되지 않았습니다. 잠시후 다시 시도해주세요.');
      });
  }

  async declineMannerTemp(manager: EntityManager, phoneNumber: String) {
    return await manager
      .getRepository(User)
      .findOne({
        where: {
          phoneNumber,
        },
      })
      .then(user => {
        user.mannerTemp -= 0.1;
        user.save();
      });
  }

  async updateBlindState(manager: EntityManager, complaintId: number) {
    const userComplaint = await this.findOne(complaintId);
    if (!userComplaint) {
      throw new NotFoundException(`complaintId가 ${complaintId}에 해당하는 데이터가 없습니다.`);
    }
    return await manager
      .getRepository(User)
      .createQueryBuilder('User')
      .update(User)
      .set({ reportHandling: true })
      .where('phoneNumber = :phoneNumber', { phoneNumber: userComplaint.complaintUser.phoneNumber })
      .execute();
  }

  async afterCompleteReportHandlingOfUser(manager: EntityManager, complaintId: number) {
    return await manager
      .getRepository(UserComplaints)
      .findOne(complaintId)
      .then(userComplaint => {
        userComplaint.processState.processStateId = 4;
        userComplaint.save();
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('신고 검토 후 처리가 제대로 되지 않았습니다. 잠시후 다시 시도해주세요.');
      });
  }

  async updateUserReportedTimes(manager: EntityManager, phoneNumber: string) {
    const user = await manager.getRepository(User).findOne(phoneNumber);
    if (!user) {
      throw new NotFoundException('해당 유저는 존재하지 않습니다.');
    }
    user.reportedTimes += 1;
    await manager.save(user);
  }

  async updateUserSuspensionOfUse(manager: EntityManager, phoneNumber: string) {
    const user = await manager.getRepository(User).findOne(phoneNumber);
    if (!user) {
      throw new NotFoundException('해당 유저는 존재하지 않습니다.');
    }
    user.suspensionOfUse = true;
    await manager.save(user);
  }

  async getUsersInSuspensionOfUse(page: number, perPage: number) {
    return await getRepository(User)
      .createQueryBuilder('user')
      .select()
      .where('suspensionOfUse = :suspensionOfUse', { suspensionOfUse: true })
      .orderBy('user.createdAt', 'DESC')
      .offset((page - 1) * perPage)
      .limit(perPage)
      .getMany();
  }
}
