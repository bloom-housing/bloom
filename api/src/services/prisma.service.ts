import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';

/*
    This service sets up our database connections
*/
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const host = `${process.env.DB_HOST}`
    const port = parseInt(process.env.DB_PORT, 10)
    const user = `${process.env.DB_USER}`
    const database = `${process.env.DB_DATABASE}`

    type PasswordPromise = () => Promise<string>
    let password: string | PasswordPromise = `${process.env.DB_PASSWORD}`
    if (process.env.DB_USE_RDS_IAM_AUTH) {
      const signer = new Signer({
        hostname: host,
        port,
        username: user,
      })
      password = async function() {
        return await signer.getAuthToken();
      }
    }

    const connPool = new Pool({
      host,
      port,
      user,
      database,
      password,
      ssl: {
        rejectUnauthorized: false // use SSL, but don't validate DB cert
      }
    });
    super({ adapter: new PrismaPg(connPool) });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
