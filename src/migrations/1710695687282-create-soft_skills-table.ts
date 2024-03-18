import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSoftSkillsTable1710695687282 implements MigrationInterface {
  name = 'CreateSoftSkillsTable1710695687282';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "soft_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_3c913a9929456dcb626cf46f0a1" UNIQUE ("name"), CONSTRAINT "PK_88c886b3eaaece0553df719bae1" PRIMARY KEY ("id"))`,
    );

    await queryRunner.manager.save(`soft_skills`, [
      { name: 'Empathy' },
      { name: 'Conflict resolution' },
      { name: 'Public speaking' },
      { name: 'Communication' },
      { name: 'Active listening' },
      { name: 'Feedback' },
      { name: 'Improves based on feedback' },
      { name: 'Creative thinking' },
      { name: 'Troubleshooting' },
      { name: 'Problem-solving' },
      { name: 'Problem identification' },
      { name: 'Risk management' },
      { name: 'Critical thinking' },
      { name: 'Prioritization' },
      { name: 'Inspires others' },
      { name: 'Constructive communication' },
      { name: 'Initiative' },
      { name: 'Reflection' },
      { name: 'Information gathering' },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "soft_skills"`);
  }
}
