import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserProfilesTable1711447518749 implements MigrationInterface {
  name = 'UpdateUserProfilesTable1711447518749';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(
      `SELECT users.id as id, phone_number, up.id as profile_id FROM "users" LEFT JOIN public.user_profiles up on users.id = up.user_id`,
    );

    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_number"`);
    await queryRunner.query(`ALTER TABLE "user_profiles" ADD "phone_number" character varying`);

    for (const user of users) {
      if (user.profile_id) {
        await queryRunner.manager.update(
          'user_profiles',
          { user: { id: user.id } },
          {
            phoneNumber: user.phone_number,
          },
        );
      } else {
        await queryRunner.manager.save('user_profiles', {
          phoneNumber: user.phone_number,
          user: { id: user.id },
        });
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const profiles = await queryRunner.query(`SELECT user_id, phone_number FROM "user_profiles"`);
    await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "phone_number"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "phone_number" character varying`);

    for (const profile of profiles) {
      await queryRunner.query(`UPDATE "users" SET phone_number = $1 WHERE id = $2`, [
        profile.phone_number,
        profile.user_id,
      ]);
    }
  }
}
