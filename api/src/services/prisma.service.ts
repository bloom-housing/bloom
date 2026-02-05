import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Signer } from '@aws-sdk/rds-signer';

/*
    This service sets up our database connections
*/
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
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
        ssl: {
          rejectUnauthorized: false, // use SSL, but don't validate DB cert
        },
      });
      super({ adapter: new PrismaPg(pool) });
    } else {
      // Maintain backwards-compatibility for non-RDS IAM deployments.
      super();
    }
  }

  async onModuleInit() {
    await this.$connect();
  }
}
