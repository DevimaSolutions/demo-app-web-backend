import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserProfilesTable1710845022257 implements MigrationInterface {
  name = 'UpdateUserProfilesTable1710845022257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_3ad486d7e9d4f6f462c1830e0b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "UQ_3ad486d7e9d4f6f462c1830e0b2" UNIQUE ("file_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_3ad486d7e9d4f6f462c1830e0b2" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_3ad486d7e9d4f6f462c1830e0b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "UQ_3ad486d7e9d4f6f462c1830e0b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_3ad486d7e9d4f6f462c1830e0b2" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
