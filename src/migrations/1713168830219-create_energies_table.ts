import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEnergiesTable1713168830219 implements MigrationInterface {
  name = 'CreateEnergiesTable1713168830219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(
      `SELECT u.id, us.type FROM users u LEFT JOIN user_subscriptions us on u.id = us.user_id AND us.end_at >= current_date `,
    );
    await queryRunner.query(
      `CREATE TABLE "energies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "energy" integer NOT NULL DEFAULT '3', "spent_in" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "REL_5aa756b440792944d4d1eeae5f" UNIQUE ("user_id"), CONSTRAINT "PK_c226e6bdb48f4d80892c143337b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "energies" ADD CONSTRAINT "FK_5aa756b440792944d4d1eeae5fc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    for (const user of users) {
      await queryRunner.query(`INSERT INTO "energies" (user_id, energy) VALUES ($1, $2)`, [
        user.id,
        user.type ? 5 : 3,
      ]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "energies" DROP CONSTRAINT "FK_5aa756b440792944d4d1eeae5fc"`,
    );
    await queryRunner.query(`DROP TABLE "energies"`);
  }
}
