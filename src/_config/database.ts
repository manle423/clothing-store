import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as entities from '../entities';
import 'dotenv/config';

const database: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: Object.values(entities),
  synchronize: true,

};

export default database;
