import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  CACHE_MANAGER,
} from "@nestjs/common"
import { Observable, of } from "rxjs"
import { RedisCache } from "./types/redis-types"
import { mapTo } from "../shared/mapTo"
import { ListingDto } from "../listings/dto/listing.dto"

@Injectable()
export class ListingLangCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: RedisCache) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const [
      {
        headers: { language },
        params: { listingId },
      },
    ] = context.getArgs()
    const cacheKey = language ? `${language}-${listingId}` : listingId
    const cacheResult = await this.cacheManager.store.get(cacheKey)
    if (cacheResult !== null) {
      return of(mapTo(ListingDto, cacheResult))
    }

    return next.handle()
  }
}
