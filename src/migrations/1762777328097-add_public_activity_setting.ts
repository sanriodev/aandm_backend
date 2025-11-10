import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublicActivitySetting1762777328097 implements MigrationInterface {
    name = 'AddPublicActivitySetting1762777328097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "publicActivity" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "accessPermissions" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "navPermissions" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "appPermissions" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "refreshTokens" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "appTokens" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "appTokens" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "refreshTokens" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "appPermissions" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "navPermissions" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "accessPermissions" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "publicActivity"`);
    }

}
