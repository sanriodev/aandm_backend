export default {
  type: process.env.SQL_TYPE ?? 'mariadb',
  host: process.env.SQL_HOST,
  port: Number(process.env.SQL_PORT),
  username: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DATABASE,
  synchronize: process.env.SQL_SYNCHRONIZE,
  entities: [__dirname + '/../../modules/**/*.entity{.js,.ts}'],
  migrations: [__dirname + '/../../migrations/*{.js,.ts}'],
  cli: {
    migrationsDir: __dirname + '/../migrations',
  },
  logging: process.env.SQL_LOGGING ?? true,
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci',
};
