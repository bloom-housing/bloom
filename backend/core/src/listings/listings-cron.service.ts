import { Inject, Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Interval } from "@nestjs/schedule"
import { ListingStatus } from "./types/listing-status-enum"
import { Repository } from "typeorm"
import { Listing } from "./entities/listing.entity"

@Injectable()
export class ListingsCronService {
  constructor(
    @InjectRepository(Listing) private readonly listingRepository: Repository<Listing>,
    @Inject(Logger) private readonly logger = new Logger(ListingsCronService.name)
  ) {}

  @Interval(1000 * 60 * 60)
  public async changeOverdueListingsStatusCron() {
    this.logger.warn("changeOverdueListingsStatusCron job running")
    const listings = await this.listingRepository
      .createQueryBuilder("listings")
      .select(["listings.id", "listings.applicationDueDate", "listings.status"])
      .where(`listings.status = '${ListingStatus.active}'`)
      .andWhere(`listings.applicationDueDate IS NOT NULL`)
      .andWhere(`listings.applicationDueDate < NOW()`)
      .getMany()

    for (const listing of listings) {
      listing.status = ListingStatus.closed
      listing.closedAt = new Date()
    }

    await this.listingRepository.save(listings)
    this.logger.warn(`Changed the status of ${listings?.length} listings`)
  }
}
