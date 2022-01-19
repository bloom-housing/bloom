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
        MFA_CODE_LENGTH: Joi.number().default(6),
        MFA_CODE_VALID_MS: Joi.number().default(1000 * 60 * 5),
        TWILIO_ACCOUNT_SID: Joi.string().default("AC_dummy_account_sid"),
        TWILIO_AUTH_TOKEN: Joi.string().default("dummy_auth_token"),
        TWILIO_PHONE_NUMBER: Joi.string().default("dummy_phone_number"),
        AUTH_LOCK_LOGIN_AFTER_FAILED_ATTEMPTS: Joi.number().default(5),
        AUTH_LOCK_LOGIN_COOLDOWN_MS: Joi.number().default(1000 * 60 * 30),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class SharedModule {}
