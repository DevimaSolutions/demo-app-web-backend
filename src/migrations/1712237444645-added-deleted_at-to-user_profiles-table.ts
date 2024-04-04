import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDeletedAtToUserProfilesTable1712237444645 implements MigrationInterface {
  name = 'AddedDeletedAtToUserProfilesTable1712237444645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`SELECT * FROM "users" WHERE deleted_at IS NOT NULL `);
    await queryRunner.query(`ALTER TABLE "user_profiles" ADD "deleted_at" TIMESTAMP`);
    for (const user of users) {
      await queryRunner.query(`UPDATE "user_profiles" SET deleted_at = $1 WHERE user_id = $2`, [
        user.deleted_at,
        user.id,
      ]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "deleted_at"`);
  }
}
