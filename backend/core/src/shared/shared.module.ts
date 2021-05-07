import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import Joi from "joi"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3100).required(),
        NODE_ENV: Joi.string()
          .valid("development", "staging", "production", "test")
          .default("development"),
        DATABASE_URL: Joi.string().required(),
        REDIS_TLS_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [],
  exports: [],
})
export class SharedModule {}
