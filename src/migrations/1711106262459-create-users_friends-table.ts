import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersFriendsTable1711106262459 implements MigrationInterface {
  name = 'CreateUsersFriendsTable1711106262459';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_friends" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "friend_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_160752e50a8572eafe1100a3c25" PRIMARY KEY ("user_id", "friend_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_friends" ADD CONSTRAINT "FK_da2a42ba5b9efdff96e51933580" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_friends" ADD CONSTRAINT "FK_e34138e1a57cc876f9f0cf0f5a2" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_friends" DROP CONSTRAINT "FK_e34138e1a57cc876f9f0cf0f5a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_friends" DROP CONSTRAINT "FK_da2a42ba5b9efdff96e51933580"`,
    );
    await queryRunner.query(`DROP TABLE "users_friends"`);
  }
}
