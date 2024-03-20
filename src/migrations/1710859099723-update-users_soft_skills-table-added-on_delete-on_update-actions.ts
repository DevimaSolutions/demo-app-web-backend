import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsersSoftSkillsTableAddedOnDeleteOnUpdateActions1710859099723
  implements MigrationInterface
{
  name = 'UpdateUsersSoftSkillsTableAddedOnDeleteOnUpdateActions1710859099723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_soft_skills" DROP CONSTRAINT "FK_52979b8024d9bdb1b8fcf9a0e28"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_soft_skills" DROP CONSTRAINT "FK_ef0549e4f36cde32a8d8f12a528"`,
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
    await queryRunner.query(
      `ALTER TABLE "users_soft_skills" ADD CONSTRAINT "FK_ef0549e4f36cde32a8d8f12a528" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_soft_skills" ADD CONSTRAINT "FK_52979b8024d9bdb1b8fcf9a0e28" FOREIGN KEY ("soft_skill_id") REFERENCES "soft_skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
