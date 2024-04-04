import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUniqueNicknameAndEmailFromUsersTable1712237709782 implements MigrationInterface {
  name = 'RemoveUniqueNicknameAndEmailFromUsersTable1712237709782';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_ad02a1be8707004cb805a4b5023"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`SELECT * FROM "users" WHERE deleted_at IS NOT NULL `);
    for (const user of users) {
      const name = user.email.split('@');
      const hash = new Date(user.deleted_at).getTime().toString(32);
      const email = `${name[0]}_${hash}_old@${name[1]}`;
      await queryRunner.query(`UPDATE "users" SET email = $1, nickname = $2 WHERE id = $3`, [
        email,
        `${user.nickname}_${hash}_old`,
        user.id,
      ]);
    }
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_ad02a1be8707004cb805a4b5023" UNIQUE ("nickname")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    );
  }
}
