import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import Joi from "joi"

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().default(3100).required(),
        NODE_ENV: Joi.string()
          .valid("development", "staging", "production", "test")
          .default("development"),
        EMAIL_API_KEY: Joi.string().required(),
        EMAIL_FROM_ADDRESS: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        REDIS_TLS_URL: Joi.string().required(),
        REDIS_USE_TLS: Joi.number().required(),
        THROTTLE_TTL: Joi.number().default(1),
        THROTTLE_LIMIT: Joi.number().default(9999999999999999),
        APP_SECRET: Joi.string().required().min(16),
        CLOUDINARY_SECRET: Joi.string().required(),
        CLOUDINARY_KEY: Joi.string().required(),
        PARTNERS_PORTAL_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class SharedModule {}
