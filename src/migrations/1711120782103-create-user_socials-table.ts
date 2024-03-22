import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserSocialsTable1711120782103 implements MigrationInterface {
  name = 'CreateUserSocialsTable1711120782103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`SELECT * FROM "users"`);

    await queryRunner.query(
      `CREATE TABLE "user_socials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "google_id" character varying, "linkedin_id" character varying, "user_id" uuid NOT NULL, CONSTRAINT "UQ_f8943c1f203207bf0da10d5bcd2" UNIQUE ("google_id"), CONSTRAINT "UQ_16e8434428e5e6d3e525b6d6439" UNIQUE ("linkedin_id"), CONSTRAINT "REL_5c54c2fb2b23d26200fe67514b" UNIQUE ("user_id"), CONSTRAINT "PK_b83c619b4b264f307240eb419ec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "google_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_19d6c798f6ec73e07b8582676a7"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "linkedin_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_socials" ADD CONSTRAINT "FK_5c54c2fb2b23d26200fe67514bd" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    if (!!users.length) {
      for (const user of users) {
        await queryRunner.query(
          `INSERT INTO "user_socials" (google_id, linkedin_id, user_id) VALUES ($1, $2, $3)`,
          [user.google_id, user.linkedin_id, user.id],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const user_socials = await queryRunner.query(`SELECT * FROM "user_socials"`);

    await queryRunner.query(
      `ALTER TABLE "user_socials" DROP CONSTRAINT "FK_5c54c2fb2b23d26200fe67514bd"`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "linkedin_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_19d6c798f6ec73e07b8582676a7" UNIQUE ("linkedin_id")`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "google_id" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b" UNIQUE ("google_id")`,
    );
    await queryRunner.query(`DROP TABLE "user_socials"`);

    if (!!user_socials.length) {
      for (const social of user_socials) {
        await queryRunner.query(
          `UPDATE "users" SET google_id = $1, linkedin_id = $2 WHERE id = $3`,
          [social.google_id, social.linkedin_id, social.user_id],
        );
      }
    }
  }
}
