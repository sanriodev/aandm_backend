import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1756281621539 implements MigrationInterface {
    name = 'Init1756281621539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying, "isDone" boolean NOT NULL DEFAULT false, "taskListId" integer NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_list" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e9f70d01f59395c1dfdc633ae37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "roleName" character varying NOT NULL, "accessPermissions" text array NOT NULL DEFAULT ARRAY[]::text[], "navPermissions" text array NOT NULL DEFAULT ARRAY[]::text[], "appPermissions" text array NOT NULL DEFAULT ARRAY[]::text[], CONSTRAINT "UQ_a6142dcc61f5f3fb2d6899fa264" UNIQUE ("roleName"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "username" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'active', "email" character varying, "password" character varying NOT NULL, "salt" character varying NOT NULL, "permissions" text array DEFAULT ARRAY[]::text[], "refreshTokens" text array NOT NULL DEFAULT ARRAY[]::text[], "appTokens" text array NOT NULL DEFAULT ARRAY[]::text[], "navPermissions" text, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "note" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying, "userId" character varying NOT NULL, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_47fc40cc98de35bf7aaaaaeeac5" FOREIGN KEY ("taskListId") REFERENCES "task_list"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_47fc40cc98de35bf7aaaaaeeac5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4be2f7adf862634f5f803d246b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f9286e6c25594c6b88c108db7"`);
        await queryRunner.query(`DROP TABLE "user_roles_role"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "task_list"`);
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
