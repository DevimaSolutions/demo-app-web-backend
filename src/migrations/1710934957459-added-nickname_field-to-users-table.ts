import { MigrationInterface, QueryRunner } from 'typeorm';

import { HasherService } from '@/features/users';

export class AddedNicknameFieldToUsersTable1710934957459 implements MigrationInterface {
  name = 'AddedNicknameFieldToUsersTable1710934957459';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasher = new HasherService();
    const users = await queryRunner.query(`SELECT "id", "email" FROM "users"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "nickname" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_ad02a1be8707004cb805a4b5023" UNIQUE ("nickname")`,
    );

    for (const user of users) {
      await queryRunner.query(`UPDATE "users" SET nickname = $1 WHERE id = $2`, [
        hasher.generateRandomNicknameFromEmail(user.email),
        user.id,
      ]);
    }

    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "nickname" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_ad02a1be8707004cb805a4b5023"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nickname"`);
  }
}
