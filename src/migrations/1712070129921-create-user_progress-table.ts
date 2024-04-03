import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserProgressTable1712070129921 implements MigrationInterface {
  name = 'CreateUserProgressTable1712070129921';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`SELECT * FROM "users"`);
    await queryRunner.query(
      `CREATE TABLE "user_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "level" integer DEFAULT '1', "experience" integer DEFAULT '1000', "user_id" uuid NOT NULL, CONSTRAINT "REL_c41601eeb8415a9eb15c8a4e55" UNIQUE ("user_id"), CONSTRAINT "PK_7b5eb2436efb0051fdf05cbe839" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_progress" ADD CONSTRAINT "FK_c41601eeb8415a9eb15c8a4e557" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    if (!!users.length) {
      for (const user of users) {
        await queryRunner.query(`INSERT INTO "user_progress" (user_id) VALUES ($1)`, [user.id]);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_progress" DROP CONSTRAINT "FK_c41601eeb8415a9eb15c8a4e557"`,
    );
    await queryRunner.query(`DROP TABLE "user_progress"`);
  }
}
