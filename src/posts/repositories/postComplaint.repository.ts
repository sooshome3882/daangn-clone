import { SearchPostComplaintDto } from 'src/admins/dto/searchPostComplaint.dto';
import { EntityRepository, Repository } from 'typeorm';
import { PostComplaints } from '../postComplaints.entity';

@EntityRepository(PostComplaints)
export class PostComplaintsRepository extends Repository<PostComplaints> {
  async getPostComplaints(searchPostComplaintDto: SearchPostComplaintDto): Promise<PostComplaints[]> {
    const { complaintReason, processState, memo, perPage, page } = searchPostComplaintDto;
    const queryBuilder = this.createQueryBuilder('postComplaints')
      .innerJoinAndSelect('postComplaints.post', 'post')
      .innerJoinAndSelect('postComplaints.complaintReason', 'complaintReason')
      .innerJoinAndSelect('postComplaints.processState', 'processState')
      .orderBy('postComplaints.createdAt', 'DESC')
      .offset((page - 1) * perPage)
      .limit(perPage);
    if (complaintReason) queryBuilder.andWhere('complaintReason.complaintReasonId = :complaintReason', { complaintReason });
    if (processState) queryBuilder.andWhere('processState.processStateId = :processState', { processState });
    if (memo) queryBuilder.andWhere('memo like :memo', { memo: `%${memo}%` });
    return queryBuilder.getMany();
  }
}
