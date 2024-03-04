import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsersTable1709562805491 implements MigrationInterface {
  name = 'UpdateUsersTable1709562805491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "phone_number" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD "email_verified" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "name_first" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "name_last" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name_last"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name_first"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email_verified"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_number"`);
  }
}
