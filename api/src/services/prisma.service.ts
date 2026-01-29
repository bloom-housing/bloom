import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool, Config } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';

/*
    This service sets up our database connections
*/
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const config: Config = {};

    if (process.env.DB_USE_RDS_IAM_AUTH) {
      // Users of RDS IAM authentication are required to pass in variables separately to avoid
      // potential issues with parsing the connection string.
      config.host = `${process.env.DB_HOST}`;
      config.port = parseInt(process.env.DB_PORT, 10);
      config.user = `${process.env.DB_USER}`;
      config.database = `${process.env.DB_DATABASE}`;

      config.ssl = {
        rejectUnauthorized: false, // use SSL, but don't validate DB cert
      };
      const signer = new Signer({
        hostname: config.host,
        port: config.port,
        username: config.user,
      });
      config.password = async function () {
        return await signer.getAuthToken();
      };
    } else if (process.env.DATABASE_URL) {
      // Maintain compatibility with existing deployments of Bloom API.
      config.connectionString = `${process.env.DATABASE_URL}`;
    }

    const connPool = new Pool(config);
    super({ adapter: new PrismaPg(connPool) });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
