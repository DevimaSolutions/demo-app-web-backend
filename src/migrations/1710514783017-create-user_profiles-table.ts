import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserProfilesTable1710514783017 implements MigrationInterface {
  name = 'CreateUserProfilesTable1710514783017';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_profiles_gender_enum" AS ENUM('male', 'female', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_profiles_profile_type_enum" AS ENUM('student', 'professional', 'careerShifter')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_profiles_learning_pace_enum" AS ENUM('relaxed', 'ambitious', 'focused')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "age" integer, "gender" "public"."user_profiles_gender_enum", "profile_type" "public"."user_profiles_profile_type_enum", "learning_pace" "public"."user_profiles_learning_pace_enum", "is_onboarding_completed" boolean NOT NULL DEFAULT false, "file_id" uuid, CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "profile_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_3ad486d7e9d4f6f462c1830e0b2" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"`);
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_3ad486d7e9d4f6f462c1830e0b2"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_id"`);
    await queryRunner.query(`DROP TABLE "user_profiles"`);
    await queryRunner.query(`DROP TYPE "public"."user_profiles_learning_pace_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_profiles_profile_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_profiles_gender_enum"`);
  }
}
