import { EntityRepository, Repository } from 'typeorm';
import { SearchComplaintDto } from 'src/admins/dto/searchComplaint.dto';
import { UserComplaints } from '../entities/userComplaints.entity';

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
}
