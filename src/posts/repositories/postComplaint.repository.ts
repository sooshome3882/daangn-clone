import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EntityManager, EntityRepository, getRepository, Repository } from 'typeorm';
import { Post } from '../post.entity';
import { PostComplaints } from '../entities/postComplaints.entity';
import { SearchComplaintDto } from 'src/admins/dto/searchComplaint.dto';

@EntityRepository(PostComplaints)
export class PostComplaintsRepository extends Repository<PostComplaints> {
  getPostComplaints(searchComplaintDto: SearchComplaintDto) {
    const { complaintReason, processState, memo, perPage, page } = searchComplaintDto;
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

  async getPostComplaintById(complaintId: number) {
    const found = await this.findOne(complaintId);
    return found;
  }

  async examinePostReport(complaintId: number) {
    return await this.findOne(complaintId)
      .then(postComplaints => {
        postComplaints.processState.processStateId = 2;
        postComplaints.save();
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('신고 접수 다음 단계로 넘어가지 않았습니다. 잠시후 다시 시도해주세요.');
      });
  }

  async completeReportHandlingOfPost(manager: EntityManager, complaintId: number) {
    return await manager
      .getRepository(PostComplaints)
      .findOne(complaintId)
      .then(postComplaints => {
        postComplaints.processState.processStateId = 3;
        postComplaints.save();
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('신고 검토가 제대로 되지 않았습니다. 잠시후 다시 시도해주세요.');
      });
  }

  async updateReportHandlingOfPost(complaintId: number) {
    const postsComplaint = await this.findOne(complaintId);
    if (!postsComplaint) {
      throw new NotFoundException(`complaintId가 ${complaintId}에 해당하는 데이터가 없습니다.`);
    }
    return await getRepository(Post).createQueryBuilder('Post').update(Post).set({ reportHandling: true }).where('postId = :postId', { postId: postsComplaint.post.postId }).execute();
  }

  async afterCompleteReportHandlingOfPost(manager: EntityManager, complaintId: number) {
    return await manager
      .getRepository(PostComplaints)
      .findOne(complaintId)
      .then(postComplaints => {
        postComplaints.processState.processStateId = 4;
        postComplaints.save();
      })
      .catch(err => {
        console.error(err);
        throw new InternalServerErrorException('신고 검토 후 처리가 제대로 되지 않았습니다. 잠시후 다시 시도해주세요.');
      });
  }

  async updateBlindState(manager: EntityManager, postId: number) {
    return await manager.getRepository(Post).createQueryBuilder('post').update(Post).set({ reportHandling: true }).where('postId = :postId', { postId }).execute();
  }
}
