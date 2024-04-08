import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserSubscriptionsTable1712576237335 implements MigrationInterface {
  name = 'CreateUserSubscriptionsTable1712576237335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "metadata" json, "description" text, "paymentMethod" character varying NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "start_at" TIMESTAMP NOT NULL, "end_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_9e928b0954e51705ab44988812c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_0641da02314913e28f6131310eb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_0641da02314913e28f6131310eb"`,
    );
    await queryRunner.query(`DROP TABLE "user_subscriptions"`);
  }
}
