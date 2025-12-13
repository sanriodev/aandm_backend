import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeSaltNullable1765559051399 implements MigrationInterface {
  name = 'MakeSaltNullable1765559051399';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "accessPermissions" SET DEFAULT ARRAY[]::text[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "navPermissions" SET DEFAULT ARRAY[]::text[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "appPermissions" SET DEFAULT ARRAY[]::text[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "salt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "refreshTokens" SET DEFAULT ARRAY[]::text[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "appTokens" SET DEFAULT ARRAY[]::text[]`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "appTokens" SET DEFAULT ARRAY[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "refreshTokens" SET DEFAULT ARRAY[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "salt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "appPermissions" SET DEFAULT ARRAY[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "navPermissions" SET DEFAULT ARRAY[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "accessPermissions" SET DEFAULT ARRAY[]`,
    );
  }
}
