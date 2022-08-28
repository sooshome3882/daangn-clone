import { EntityRepository, getRepository, Repository } from "typeorm";
import { CreatePostDto } from "./dto/createPost.dto";
import { UpdatePostDto } from "./dto/updatePost.dto";
import { Post } from "./post.entity";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {

  async createPost(createPostDto: CreatePostDto): Promise<number> {
    const { title, content, category, price, isOfferedPrice, townRange, dealState } = createPostDto;
    const query = await getRepository(Post)
      .createQueryBuilder('Post')
      .insert()
      .into(Post)
      .values({title, content, price, isOfferedPrice, category, townRange, dealState})
      .execute();
    return query.raw.insertId;
  }

  async updatePost(postId: number, updatePostDto: UpdatePostDto): Promise<void> {
    const { title, content, category, price, isOfferedPrice, townRange } = updatePostDto;
    await getRepository(Post)
      .createQueryBuilder('Post')
      .update(Post)
      .set({title, content, price, isOfferedPrice, category, townRange})
      .where('postId = :postId', { postId: postId })
      .execute();
  }
}