import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserPersonalTokensTable1709908528382 implements MigrationInterface {
  name = 'CreateUserPersonalTokensTable1709908528382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user-personal-tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "scopes" character varying array NOT NULL, "revoked" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" TIMESTAMP NOT NULL, "user_id" uuid, CONSTRAINT "PK_df682da580096efe754da469a4a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-personal-tokens" ADD CONSTRAINT "FK_0cbbe27de0e7618e0c26f528d70" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user-personal-tokens" DROP CONSTRAINT "FK_0cbbe27de0e7618e0c26f528d70"`,
    );
    await queryRunner.query(`DROP TABLE "user-personal-tokens"`);
  }
}
