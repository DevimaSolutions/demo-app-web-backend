import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEnergyTable1712819920292 implements MigrationInterface {
  name = 'CreateEnergyTable1712819920292';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(
      `SELECT u.id, us.type FROM users u LEFT JOIN user_subscriptions us on u.id = us.user_id AND us.end_at >= current_date `,
    );

    await queryRunner.query(
      `CREATE TABLE "energy" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "energy" integer NOT NULL DEFAULT '3', "spent_in" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "REL_131033f61881be810a08e5e247" UNIQUE ("user_id"), CONSTRAINT "PK_a55d76c376e930cae65f564b95f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "energy" ADD CONSTRAINT "FK_131033f61881be810a08e5e247b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    for (const user of users) {
      await queryRunner.query(`INSERT INTO "energy" (user_id, energy) VALUES ($1, $2)`, [
        user.id,
        user.type ? 5 : 3,
      ]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "energy" DROP CONSTRAINT "FK_131033f61881be810a08e5e247b"`,
    );
    await queryRunner.query(`DROP TABLE "energy"`);
  }
}
