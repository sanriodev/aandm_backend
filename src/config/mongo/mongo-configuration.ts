import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  uri: process.env.MONGO_URI,
  port: process.env.MONGO_PORT,
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  database: process.env.MONGO_DATABASE,
  migrationsRun: process.env.MONGO_RUN_MIGRATION,
  synchronizeRun: process.env.MONGO_RUN_SYNCHRONIZE,
  entities: process.env.MONGO_ENTITIES,
}));
