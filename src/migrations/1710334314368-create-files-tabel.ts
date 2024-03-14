import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFilesTabel1710334314368 implements MigrationInterface {
  name = 'CreateFilesTabel1710334314368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, "size" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_332d10755187ac3c580e21fbc0" ON "files" ("name") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_332d10755187ac3c580e21fbc0"`);
    await queryRunner.query(`DROP TABLE "files"`);
  }
}
