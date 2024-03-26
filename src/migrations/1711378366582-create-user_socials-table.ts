import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserSocialsTable1711378366582 implements MigrationInterface {
  name = 'CreateUserSocialsTable1711378366582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`SELECT * FROM "users"`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_socials_type_enum" AS ENUM('google', 'linkedin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_socials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "social_id" character varying NOT NULL, "type" "public"."user_socials_type_enum" NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_2632a167a414578b3bd0c2c543a" UNIQUE ("social_id"), CONSTRAINT "PK_b83c619b4b264f307240eb419ec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "google_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_19d6c798f6ec73e07b8582676a7"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "linkedin_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_socials" ADD CONSTRAINT "FK_5c54c2fb2b23d26200fe67514bd" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    if (!!users.length) {
      for (const user of users) {
        if (user.google_id) {
          await queryRunner.query(
            `INSERT INTO "user_socials" (social_id, user_id, type) VALUES ($1, $2, $3)`,
            [user.google_id, user.id, 'google'],
          );
        }

        if (user.linkedin_id) {
          await queryRunner.query(
            `INSERT INTO "user_socials" (social_id, user_id, type) VALUES ($1, $2, $3)`,
            [user.linkedin_id, user.id, 'linkedin'],
          );
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const socials = await queryRunner.query(`SELECT * FROM "user_socials"`);
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
    await queryRunner.query(`DROP TYPE "public"."user_socials_type_enum"`);

    if (!!socials.length) {
      for (const social of socials) {
        if (social.type === 'google') {
          await queryRunner.query(`UPDATE "users" SET google_id = $1 WHERE id = $2`, [
            social.social_id,
            social.user_id,
          ]);
        } else if (social.type === 'linkedin') {
          await queryRunner.query(`UPDATE "users" SET linkedin_id = $1 WHERE id = $2`, [
            social.social_id,
            social.user_id,
          ]);
        }
      }
    }
  }
}
