import { Inject, Injectable, Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Interval } from "@nestjs/schedule"
import { ListingStatus } from "./types/listing-status-enum"
import { ListingRepository } from "./db/listing.repository"

@Injectable()
export class ListingsCronService {
  constructor(
    @InjectRepository(ListingRepository) private readonly listingRepository: ListingRepository,
    @Inject(Logger) private readonly logger = new Logger(ListingsCronService.name)
  ) {}

  @Interval(1000 * 60 * 60)
  public async changeOverdueListingsStatusCron() {
    this.logger.log("changeOverdueListingsStatusCron job running")
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
    this.logger.log(`Changed the status of ${listings?.length} listings`)
  }
}
