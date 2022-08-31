import { AcceptOfferedPriceDto } from './dto/acceptOfferedPrice.dto';
import { OfferPriceDto } from './dto/offerPrice.dto';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { CreatePostDto } from './dto/createPost.dto';
import { SearchPostDto } from './dto/searchPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PullUpPostInputDto } from './dto/pullUpPostInput.dto';
import { Post } from './post.entity';
import { PriceOffer } from './priceOffer.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async createPost(createPostDto: CreatePostDto): Promise<number> {
    const { title, content, category, price, isOfferedPrice, townRange, dealState } = createPostDto;
    const query = await getRepository(Post).createQueryBuilder('Post').insert().into(Post).values({ title, content, price, isOfferedPrice, category, townRange, dealState }).execute();
    return query.raw.insertId;
  }

  async updatePost(postId: number, updatePostDto: UpdatePostDto): Promise<void> {
    const { title, content, category, price, isOfferedPrice, townRange } = updatePostDto;
    await getRepository(Post).createQueryBuilder('Post').update(Post).set({ title, content, price, isOfferedPrice, category, townRange }).where('postId = :postId', { postId: postId }).execute();
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
}
