import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDeletedAtUsersTables1712306786102 implements MigrationInterface {
  name = 'RemoveDeletedAtUsersTables1712306786102';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
  }
}
