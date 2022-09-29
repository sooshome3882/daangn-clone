import { ChatComplaints } from '../entities/chatComplaints.entity';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { SearchComplaintDto } from 'src/admins/dto/searchComplaint.dto';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Chat } from '../entities/chat.entity';

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

  async examineChatReport(complaintId: number) {
    return await this.findOne(complaintId)
      .then(chatComplaint => {
        chatComplaint.processState.processStateId = 2;
        chatComplaint.save();
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('신고 접수가 제대로 되지 않았습니다. 잠시후 다시 시도해주세요.');
      });
  }

  async completeReportHandlingOfChat(complaintId: number) {
    return await this.findOne(complaintId)
      .then(chatComplaint => {
        chatComplaint.processState.processStateId = 3;
        chatComplaint.save();
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('신고 검토가 제대로 되지 않았습니다. 잠시후 다시 시도해주세요.');
      });
  }

  async updateReportHandlingOfChat(complaintId: number) {
    const chatComplaint = await this.findOne(complaintId);
    if (!chatComplaint) {
      throw new NotFoundException(`complaintId가 ${complaintId}에 해당하는 데이터가 없습니다.`);
    }
    await getRepository(Chat).createQueryBuilder('Chat').update(Chat).set({ reportHandling: true }).where('chatId = :chatId', { chatId: chatComplaint.chat.chatId }).execute();
  }

  async afterCompleteReportHandlingOfChat(complaintId: number) {
    return await this.findOne(complaintId)
      .then(ChatComplaint => {
        ChatComplaint.processState.processStateId = 4;
        ChatComplaint.save();
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('신고 검토 후 처리가 제대로 되지 않았습니다. 잠시후 다시 시도해주세요.');
      });
  }
}
