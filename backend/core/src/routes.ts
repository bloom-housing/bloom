import { Routes } from "nest-router"
import { AppModule } from "./v1/app.module"
import { AppModule as AppModuleV2 } from "./v2/app.module"

export const routes: Routes = [
  {
    path: "/",
    module: AppModule,
  },
  {
    path: "/v2",
    module: AppModuleV2,
  },
]

export {}
