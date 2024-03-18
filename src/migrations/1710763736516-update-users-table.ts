import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsersTable1710763736516 implements MigrationInterface {
  name = 'UpdateUsersTable1710763736516';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`SELECT "id", "profile_id" FROM "users"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_id"`);
    await queryRunner.query(`ALTER TABLE "user_profiles" ADD "user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "UQ_6ca9503d77ae39b4b5a6cc3ba88" UNIQUE ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    for (const user of users) {
      await queryRunner.query(`UPDATE "user_profiles" SET user_id   = $1 WHERE id = $2`, [
        user.id,
        user.profile_id,
      ]);
    }

    await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "user_id" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const profiles = await queryRunner.query(`SELECT "id", "user_id" FROM "user_profiles"`);
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "UQ_6ca9503d77ae39b4b5a6cc3ba88"`,
    );
    await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "profile_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    for (const profile of profiles) {
      await queryRunner.query(`UPDATE "users" SET profile_id  = $1 WHERE id = $2`, [
        profile.id,
        profile.user_id,
      ]);
    }
  }
}
