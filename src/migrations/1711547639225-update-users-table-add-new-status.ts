import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsersTableAddNewStatus1711547639225 implements MigrationInterface {
  name = 'UpdateUsersTableAddNewStatus1711547639225';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(
      `SELECT * FROM "users" LEFT JOIN public.user_profiles up on users.id = up.user_id`,
    );
    await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "is_onboarding_completed"`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'pending'`);

    for (const user of users) {
      const status =
        user.email_verified && user.is_onboarding_completed
          ? 'active'
          : user.email_verified
          ? 'verified'
          : user.status;

      await queryRunner.query(`UPDATE "users" SET status = $1 WHERE id = $2`, [status, user.id]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`SELECT id, status FROM "users"`);

    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active'`);
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD "is_onboarding_completed" boolean NOT NULL DEFAULT false`,
    );

    for (const user of users) {
      await queryRunner.query(
        `UPDATE "user_profiles" SET is_onboarding_completed = $1 WHERE id = $2`,
        [user.status === 'active', user.id],
      );
    }
  }
}
