import { SearchPostComplaintDto } from 'src/admins/dto/searchPostComplaint.dto';
import { EntityRepository, Repository } from 'typeorm';
import { PostComplaints } from '../postComplaints.entity';

@EntityRepository(PostComplaints)
export class PostComplaintsRepository extends Repository<PostComplaints> {
  getPosts(searchPostComplaintDto: SearchPostComplaintDto): any {
    const { complaintReason, processState, memo, perPage, page } = searchPostComplaintDto;
    throw new Error('Method not implemented.');
  }
}
