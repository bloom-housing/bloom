import { Routes } from "nest-router"
import { AppModule } from "./v1/app.module"

export const routes: Routes = [
  {
    path: '/',
    module: AppModule,
  },
];

export {}
