import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedLinkedinIdFieldToUsersTable1709644449723 implements MigrationInterface {
  name = ' AddedLinkedinIdFieldToUsersTable1709644449723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "linkedin_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_19d6c798f6ec73e07b8582676a7" UNIQUE ("linkedin_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_19d6c798f6ec73e07b8582676a7"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "linkedin_id"`);
  }
}
