import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedGoogleIdFieldToUsersTable1709570306256 implements MigrationInterface {
  name = 'AddedGoogleIdFieldToUsersTable1709570306256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "google_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b" UNIQUE ("google_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "google_id"`);
  }
}
