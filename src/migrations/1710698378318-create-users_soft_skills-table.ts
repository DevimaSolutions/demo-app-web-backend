import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersSoftSkillsTable1710698378318 implements MigrationInterface {
  name = 'CreateUsersSoftSkillsTable1710698378318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_soft_skills" ("user_id" uuid NOT NULL, "soft_skill_id" uuid NOT NULL, CONSTRAINT "PK_80e8c793d037108daba229ab015" PRIMARY KEY ("user_id", "soft_skill_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef0549e4f36cde32a8d8f12a52" ON "users_soft_skills" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_52979b8024d9bdb1b8fcf9a0e2" ON "users_soft_skills" ("soft_skill_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users_soft_skills" ADD CONSTRAINT "FK_ef0549e4f36cde32a8d8f12a528" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_soft_skills" ADD CONSTRAINT "FK_52979b8024d9bdb1b8fcf9a0e28" FOREIGN KEY ("soft_skill_id") REFERENCES "soft_skills"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_soft_skills" DROP CONSTRAINT "FK_52979b8024d9bdb1b8fcf9a0e28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_soft_skills" DROP CONSTRAINT "FK_ef0549e4f36cde32a8d8f12a528"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_52979b8024d9bdb1b8fcf9a0e2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ef0549e4f36cde32a8d8f12a52"`);
    await queryRunner.query(`DROP TABLE "users_soft_skills"`);
  }
}
