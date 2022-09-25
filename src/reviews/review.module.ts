import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRepository } from './review.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewRepository])],
  providers: [ReviewResolver, ReviewService],
})
export class ReviewModule {}
