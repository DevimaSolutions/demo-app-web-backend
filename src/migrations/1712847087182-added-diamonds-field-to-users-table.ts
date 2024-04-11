import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDiamondsFieldToUsersTable1712847087182 implements MigrationInterface {
  name = 'AddedDiamondsFieldToUsersTable1712847087182';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "diamonds" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "diamonds"`);
  }
}
