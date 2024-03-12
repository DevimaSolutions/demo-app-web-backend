import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsersTableAddVerificationFields1710245747767 implements MigrationInterface {
  name = 'UpdateUsersTableAddVerificationFields1710245747767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "verify_email_code" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD "verify_code_submitted_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "users" ADD "verify_code_expire_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "users" ADD "reset_password_submitted_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_password_submitted_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verify_code_expire_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verify_code_submitted_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verify_email_code"`);
  }
}
