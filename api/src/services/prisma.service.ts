import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Signer } from '@aws-sdk/rds-signer';

const KEEP_ALIVE_DELAY_MS = 10000;

/*
    This service sets up our database connections
*/
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool!: Pool;

  constructor() {
    if (process.env.DB_USE_RDS_IAM_AUTH) {
      // Users of RDS IAM authentication are required to pass in variables separately to avoid
      // potential issues with parsing the connection string.
      const host = `${process.env.DB_HOST}`;
      const port = parseInt(process.env.DB_PORT, 10);
      const user = `${process.env.DB_USER}`;
      const database = `${process.env.DB_DATABASE}`;

      const signer = new Signer({
        hostname: host,
        port: port,
        username: user,
      });

      const pool = new Pool({
        host,
        port,
        user,
        database,
        password: async function () {
          return await signer.getAuthToken();
        },
        keepAlive: true,
        keepAliveInitialDelayMillis: KEEP_ALIVE_DELAY_MS,
        ssl: { rejectUnauthorized: false }, // use SSL, but don't validate DB cert
      });
      super({ adapter: new PrismaPg(pool) });
      this.pool = pool;
    } else {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        keepAlive: true,
        keepAliveInitialDelayMillis: KEEP_ALIVE_DELAY_MS,
      });
      super({ adapter: new PrismaPg(pool) });
      this.pool = pool;
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
