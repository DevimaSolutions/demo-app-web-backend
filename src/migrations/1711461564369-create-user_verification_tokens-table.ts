import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserVerificationTokensTable1711461564369 implements MigrationInterface {
  name = 'CreateUserVerificationTokensTable1711461564369';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_verification_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "submitted_at" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying, "expire_at" TIMESTAMP DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_89e8a37ed0f9e05b477bca81e71" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_488c35bac4fae1d53ac47eb68b" ON "users_verification_tokens" ("user_id", "type") `,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verify_email_code"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verify_code_submitted_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verify_code_expire_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_password_submitted_at"`);
    await queryRunner.query(
      `ALTER TABLE "users_verification_tokens" ADD CONSTRAINT "FK_51ed3e55a36e8100aac43e8383f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_verification_tokens" DROP CONSTRAINT "FK_51ed3e55a36e8100aac43e8383f"`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "reset_password_submitted_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "users" ADD "verify_code_expire_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "users" ADD "verify_code_submitted_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "users" ADD "verify_email_code" character varying`);
    await queryRunner.query(`DROP INDEX "public"."IDX_488c35bac4fae1d53ac47eb68b"`);
    await queryRunner.query(`DROP TABLE "users_verification_tokens"`);
  }
}
