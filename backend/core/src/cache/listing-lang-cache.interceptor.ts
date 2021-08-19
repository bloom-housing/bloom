import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  CACHE_MANAGER,
} from "@nestjs/common"
import { Observable, of } from "rxjs"
import { tap } from "rxjs/operators"
import { Cache } from "cache-manager"

@Injectable()
export class ListingLangCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    try {
      const [
        {
          headers: { language },
          params: { listingId },
          query: { view },
        },
      ] = context.getArgs()
      let cacheKey = language ? `${language}-${listingId}` : listingId
      if (view) {
        cacheKey = `${cacheKey}-${view}`
      }
      const cacheResult = await this.cacheManager.get(cacheKey)
      if (cacheResult !== null) {
        return of(cacheResult)
      } else {
        return next.handle().pipe(
          tap((response) => {
            void this.cacheManager.set(cacheKey, response)
          })
        )
      }
    } catch (e) {
      console.log("Get Cache Error = ", e)
      return next.handle()
    }
  }
}
