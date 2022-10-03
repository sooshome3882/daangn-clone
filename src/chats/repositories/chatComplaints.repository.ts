import { ChatComplaints } from '../entities/chatComplaints.entity';
import { EntityRepository, Repository } from 'typeorm';
import { SearchComplaintDto } from 'src/admins/dto/searchComplaint.dto';

@EntityRepository(ChatComplaints)
export class ChatComplaintsRepository extends Repository<ChatComplaints> {
  getChatComplaints(searchComplaintDto: SearchComplaintDto) {
    const { complaintReason, processState, memo, perPage, page } = searchComplaintDto;
    const queryBuilder = this.createQueryBuilder('chatComplaints')
      .innerJoinAndSelect('chatComplaints.chat', 'chat')
      .innerJoinAndSelect('chatComplaints.user', 'user')
      .innerJoinAndSelect('chatComplaints.complaintReason', 'complaintReason')
      .innerJoinAndSelect('chatComplaints.processState', 'processState')
      .orderBy('chatComplaints.createdAt', 'DESC')
      .offset((page - 1) * perPage)
      .limit(perPage);
    if (complaintReason) queryBuilder.andWhere('complaintReason.complaintReasonId = :complaintReason', { complaintReason });
    if (processState) queryBuilder.andWhere('processState.processStateId = :processState', { processState });
    if (memo) queryBuilder.andWhere('memo like :memo', { memo: `%${memo}%` });
    return queryBuilder.getMany();
  }
}
