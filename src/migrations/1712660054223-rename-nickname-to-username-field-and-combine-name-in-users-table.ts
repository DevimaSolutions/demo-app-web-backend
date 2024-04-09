import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameNicknameToUsernameFieldAndCombineNameInUsersTable1712660054223
  implements MigrationInterface
{
  name = 'RenameNicknameToUsernameFieldAndCombineNameInUsersTable1712660054223';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(
      `SELECT id, concat(name_first, ' ', name_last) as name, nickname FROM "users"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_ad02a1be8707004cb805a4b5023"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nickname"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name_last"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name_first"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`,
    );

    for (const user of users) {
      await queryRunner.query(`UPDATE "users" SET username = $1, name = $2  WHERE id = $3`, [
        user.nickname,
        user.name,
        user.id,
      ]);
    }

    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`SELECT id, name, username FROM "users"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "name_first" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "name_last" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "nickname" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_ad02a1be8707004cb805a4b5023" UNIQUE ("nickname")`,
    );

    for (const user of users) {
      const name = user.name.split(' ');
      await queryRunner.query(
        `UPDATE "users" SET nickname = $1, name_first = $2, name_last = $3  WHERE id = $4`,
        [user.username, name?.[0] ?? '', name?.[1] ?? '', user.id],
      );
    }

    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "nickname" SET NOT NULL`);
  }
}
