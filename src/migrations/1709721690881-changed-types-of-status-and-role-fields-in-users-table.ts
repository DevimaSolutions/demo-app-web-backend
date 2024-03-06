import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedTypesOfStatusAndRoleFieldsInUsersTable1709721690881
  implements MigrationInterface
{
  name = 'ChangedTypesOfStatusAndRoleFieldsInUsersTable1709721690881';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`SELECT * FROM "users"`);

    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "status" character varying NOT NULL DEFAULT 'active'`,
    );

    if (!!users.length) {
      const mapRole = { 0: 'user', 1: 'admin' };

      const mapStatus = { 0: 'pending', 1: 'active', 2: 'blocked' };
      for (const user of users) {
        await queryRunner.query(`UPDATE "users" SET role   = $1, status = $2 WHERE id = $3`, [
          mapRole[user.role as keyof typeof mapRole],
          mapStatus[user.status as keyof typeof mapStatus],
          user.id,
        ]);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`SELECT * FROM "users"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "status" integer NOT NULL DEFAULT '1'`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "role" integer NOT NULL DEFAULT '0'`);
    if (!!users.length) {
      const mapRole = { user: 0, admin: 1 };
      const mapStatus = { pending: 0, active: 1, blocked: 2 };
      for (const user of users) {
        await queryRunner.query(`UPDATE "users" SET role   = $1, status = $2 WHERE id = $3`, [
          mapRole[user.role as keyof typeof mapRole],
          mapStatus[user.status as keyof typeof mapStatus],
          user.id,
        ]);
      }
    }

    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
  }
}
