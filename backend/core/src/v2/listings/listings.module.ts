import { Module } from "@nestjs/common"
import { ListingsController } from "./listings.controller"

@Module({ controllers: [ListingsController] })
export class ListingsModule {}
