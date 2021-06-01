import { DynamicModule, Module } from "@nestjs/common"
import { ListingsModule } from "./listings/listings.module"

@Module({})
export class AppModule {
  static register(dbOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [ListingsModule],
    }
  }
}
