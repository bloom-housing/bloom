import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common"
import { Observable } from "rxjs"

@Injectable()
export class FilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const query = context.getArgs()[0].query

    if (query.filter) {
      try {
        context.getArgs()[0].query.filter = JSON.parse(query.filter)
      } catch (e) {
        console.log("Error parsing filter: ", query.filter)
      }
    }

    return next.handle()
  }
}
