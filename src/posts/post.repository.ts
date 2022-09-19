import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateDealStateDto } from './dto/updateDealState.dto';
import { CreatePostsComplaintsDto } from './dto/createPostsComplaints.dto';
import { AcceptOfferedPriceDto } from './dto/acceptOfferedPrice.dto';
import { OfferPriceDto } from './dto/offerPrice.dto';
import { EntityRepository, getConnection, getRepository, Repository } from 'typeorm';
import { CreatePostDto } from './dto/createPost.dto';
import { SearchPostDto } from './dto/searchPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Post } from './post.entity';
import { PriceOffer } from './priceOffer.entity';
import { ProcessState } from 'src/processStates/processState.entity';
import { PostsComplaint } from './postsComplaint.entity';
import { DealState } from 'src/dealStates/dealState.entity';
import { User } from 'src/users/user.entity';
import { PostsLikeRecord } from './postsLikeRecord.entity';
import { PostsLikeDto } from './dto/addPostsLike.dto';
import { PostsViewDto } from './dto/addPostsView.dto';
import { PostsViewRecord } from './postsViewRecord.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async createPost(user: User, createPostDto: CreatePostDto): Promise<number> {
    const { title, content, category, price, isOfferedPrice, townRange, dealState } = createPostDto;
    const query = await getRepository(Post).createQueryBuilder('Post').insert().into(Post).values({ user, title, content, price, isOfferedPrice, category, townRange, dealState }).execute();
    return query.raw.insertId;
  }

  async updatePost(postId: number, updatePostDto: UpdatePostDto): Promise<void> {
    const { title, content, category, price, isOfferedPrice, townRange } = updatePostDto;
    await getRepository(Post).createQueryBuilder('Post').update(Post).set({ title, content, price, isOfferedPrice, category, townRange }).where('postId = :postId', { postId }).execute();
  }

  async getPosts(searchPostDto: SearchPostDto): Promise<Post[]> {
    const { search, minPrice, maxPrice, category, townRange, dealState, perPage, page } = searchPostDto;
    const queryBuilder = await getRepository(Post)
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.category', 'category')
      .innerJoinAndSelect('post.townRange', 'townRange')
      .innerJoinAndSelect('post.dealState', 'dealState')
      .where('isHidden = :isHidden', { isHidden: false })
      .andWhere('reportHandling = :reportHandling', { reportHandling: false })
      .andWhere('price >= :minPrice', { minPrice: minPrice })
      .orderBy('post.pulledAt', 'DESC')
      .offset((page - 1) * perPage)
      .limit(perPage);
    if (search) queryBuilder.andWhere('title like :title', { title: `%${search}%` });
    if (maxPrice !== -1) queryBuilder.andWhere('price <= :maxPrice', { maxPrice: maxPrice });
    if (category) queryBuilder.andWhere('category.categoryId = :category', { category: category });
    if (townRange) queryBuilder.andWhere('townRange.townRangeId = :townRange', { townRange: townRange });
    if (dealState) queryBuilder.andWhere('dealState.dealStateId = :dealState', { dealState: dealState });
    return queryBuilder.getMany();
  }

  async changePulled(postId: number): Promise<void> {
    await getRepository(Post).createQueryBuilder('post').update(Post).set({ pulledAt: new Date() }).where('postId = :postId', { postId }).execute();
  }

  async requestPriceToSeller(offerPriceDto: OfferPriceDto): Promise<number> {
    const { offerPrice, post } = offerPriceDto;
    const query = await getRepository(PriceOffer).createQueryBuilder('priceOffer').insert().into(PriceOffer).values({ offerPrice, post }).execute();
    return query.raw.insertId;
  }

  async responsePriceToSeller() {} // TODO: user 완성후 구현 예정

  async determineOfferedPrice(acceptOfferedPriceDto: AcceptOfferedPriceDto) {
    const { accept, priceOfferId } = acceptOfferedPriceDto;
    const priceOffered = await PriceOffer.findOne({
      where: {
        priceOfferId,
      },
    });
    const { post } = priceOffered;
    const priceOfferedPost = await Post.findOne({
      where: {
        postId: post.postId,
      },
    });
    if (accept) {
      priceOffered.accept = true;
      priceOfferedPost.isOfferedPrice = true;
      priceOfferedPost.price = priceOffered.offerPrice;
      Post.save(priceOfferedPost);
      PriceOffer.save(priceOffered);
      return priceOffered;
    } else {
      return;
    }
  }

  async updateHiddenStateTrue(postId: number) {
    await getRepository(Post).createQueryBuilder('Post').update(Post).set({ isHidden: true }).where('postId = :postId', { postId }).execute();
  }

  async updateHiddenStateFalse(postId: number) {
    await getRepository(Post).createQueryBuilder('Post').update(Post).set({ isHidden: false }).where('postId = :postId', { postId }).execute();
  }

  async putProcessStates() {
    await getRepository(ProcessState)
      .createQueryBuilder()
      .insert()
      .into(ProcessState)
      .values([
        { processStateId: 1, processState: '신고 접수' },
        { processStateId: 2, processState: '신고 검토중' },
        { processStateId: 3, processState: '신고 검토 완료 허용' },
        { processStateId: 4, processState: '신고 검토 완료 후 {메시지, 채팅, 게시글} 블라인드 시키고 사용자 매너 점수 감소' },
        { processStateId: 5, processState: '신고 검토 완료 후 {메시지, 채팅, 게시글} 블라인드 시키고 사용자 이용 정지 처분' },
      ])
      .execute();
  }

  async putDealState() {
    await getRepository(DealState)
      .createQueryBuilder()
      .insert()
      .into(DealState)
      .values([
        { dealStateId: 1, dealState: '판매중' },
        { dealStateId: 2, dealState: '예약중' },
        { dealStateId: 3, dealState: '거래완료' },
      ])
      .execute();
  }

  async createPostsComplaint(createPostsComplaintsDto: CreatePostsComplaintsDto): Promise<number> {
    const { post, complaintReason, processState } = createPostsComplaintsDto;
    const query = await getRepository(PostsComplaint)
      .createQueryBuilder('PostsComplaint')
      .insert()
      .into(PostsComplaint)
      .values({
        post,
        complaintReason,
        processState,
      })
      .execute();
    return query.raw.insertId;
  }

  async updateDealState(postId: number, updateDealStateDto: UpdateDealStateDto) {
    const { dealState } = updateDealStateDto;
    await getRepository(Post).createQueryBuilder('Post').update(Post).set({ dealState }).where('postId = :postId', { postId: postId }).execute();
  }

  async addLikeToPost(user: User, postsLikeDto: PostsLikeDto) {
    const { post } = postsLikeDto;
    const query = await getRepository(PostsLikeRecord).createQueryBuilder('postsLikeRecord').insert().into(PostsLikeRecord).values({ post, user }).execute();
    return query.raw.insertId;
  }

  async addLikeCntToPost(post: Post, likes: number) {
    likes = likes + 1;
    return await getRepository(Post).createQueryBuilder('post').update(Post).set({ likes }).where('postId = :postId', { postId: post }).execute();
  }

  async addLikeTransaction(user: User, postsLikeDto: PostsLikeDto, post: Post, likes: number) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const insertId = await this.addLikeToPost(user, postsLikeDto);
      const addLikeCntToPost = await this.addLikeCntToPost(post, likes);
      await queryRunner.manager.save(insertId);
      await queryRunner.manager.save(addLikeCntToPost);
      await queryRunner.commitTransaction();
      return insertId;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(err);
      throw new InternalServerErrorException(`좋아요 기록이 추가되지 않았습니다. 잠시후 다시 시도해주세요.`);
    } finally {
      await queryRunner.release();
    }
  }

  async substractLikeToPost(user: User, postsLikeId: number) {
    const result = await PostsLikeRecord.delete(postsLikeId);
    if (result.affected === 0) {
      throw new NotFoundException(`postsLikeId가 ${postsLikeId}인 것을 찾을 수 없습니다.`);
    } else {
      return '삭제되었습니다.';
    }
  }

  async substractLikeCntToPost(post: Post, likes: number) {
    if (likes > 0) {
      likes = likes - 1;
      return await getRepository(Post).createQueryBuilder('post').update(Post).set({ likes }).where('postId = :postId', { postId: post }).execute();
    } else {
      return;
    }
  }

  async substractLikeTransaction(user: User, postsLikeId: number, post: Post, likes: number) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const substractLikeToPost = await this.substractLikeToPost(user, postsLikeId);
      const substractLikeCntToPost = await this.substractLikeCntToPost(post, likes);
      await queryRunner.manager.save(substractLikeToPost);
      await queryRunner.manager.save(substractLikeCntToPost);
      await queryRunner.commitTransaction();
      return substractLikeToPost;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(err);
      throw new InternalServerErrorException(`좋아요 취소 기록이 추가되지 않았습니다. 잠시후 다시 시도해주세요.`);
    } finally {
      await queryRunner.release();
    }
  }

  async addViewToPost(user: User, postsViewDto: PostsViewDto) {
    const { post } = postsViewDto;
    const query = await getRepository(PostsViewRecord).createQueryBuilder('postsViewRecord').insert().into(PostsViewRecord).values({ post, user }).execute();

    return query.raw.insertId;
  }

  async addViewCntToPost(post: Post, views: number) {
    views = views + 1;
    return await getRepository(Post).createQueryBuilder('post').update(Post).set({ views }).where('postId = :postId', { postId: post }).execute();
  }

  async addViewTransaction(user: User, postsViewDto: PostsViewDto, post: Post, views: number) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const insertId = await this.addViewToPost(user, postsViewDto);
      const addViewCntToPost = await this.addViewCntToPost(post, views);
      await queryRunner.manager.save(insertId);
      await queryRunner.manager.save(addViewCntToPost);
      await queryRunner.commitTransaction();
      return insertId;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(err);
      throw new InternalServerErrorException(`조회수 기록이 추가되지 않았습니다. 잠시후 다시 시도해주세요.`);
    } finally {
      await queryRunner.release();
    }
  }
}
