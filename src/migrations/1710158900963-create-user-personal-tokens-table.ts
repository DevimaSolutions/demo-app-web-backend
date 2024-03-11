import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserPersonalTokensTable1710158900963 implements MigrationInterface {
  name = 'CreateUserPersonalTokensTable1710158900963';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_personal_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "scopes" character varying array NOT NULL, "revoked" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" TIMESTAMP NOT NULL, "user_id" uuid, CONSTRAINT "PK_f8f50b56b1b9d281d2643ee4fa0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_personal_tokens" ADD CONSTRAINT "FK_db78594233d9ef8d9cc49feca5a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_personal_tokens" DROP CONSTRAINT "FK_db78594233d9ef8d9cc49feca5a"`,
    );
    await queryRunner.query(`DROP TABLE "user_personal_tokens"`);
  }
}
