import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDeletedAtFieldToUsersTable1710758440409 implements MigrationInterface {
  name = 'AddedDeletedAtFieldToUsersTable1710758440409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
  }
}
