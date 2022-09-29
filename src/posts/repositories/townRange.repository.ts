import { TownRange } from 'src/posts/entities/townRange.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TownRange)
export class TownRangeRepository extends Repository<TownRange> {}
