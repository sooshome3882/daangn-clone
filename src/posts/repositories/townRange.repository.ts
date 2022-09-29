import { TownRange } from 'src/townRanges/townRange.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TownRange)
export class TownRangeRepository extends Repository<TownRange> {}
