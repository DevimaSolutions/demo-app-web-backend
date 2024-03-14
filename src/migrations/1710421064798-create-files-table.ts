import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFilesTable1710421064798 implements MigrationInterface {
  name = 'CreateFilesTable1710421064798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, "size" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_332d10755187ac3c580e21fbc02" UNIQUE ("name"), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_332d10755187ac3c580e21fbc0" ON "files" ("name") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_332d10755187ac3c580e21fbc0"`);
    await queryRunner.query(`DROP TABLE "files"`);
  }
}
