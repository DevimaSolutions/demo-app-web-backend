import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedFieldsToUsersFriendsTable1711634105512 implements MigrationInterface {
  name = 'AddedFieldsToUsersFriendsTable1711634105512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const friends = await queryRunner.query(`SELECT * FROM "users_friends"`);

    const group: Record<string, { user_id: string; friend_id: string }[]> = friends.reduce(
      (acc: any, item: any) => {
        if (acc[item.user_id]) {
          acc[item.user_id].push(item);
        } else {
          acc[item.friend_id] = [item];
        }
        return acc;
      },
      {} as Record<string, { user_id: string; friend_id: string }[]>,
    );

    await queryRunner.query(`ALTER TABLE "users_friends" ADD "initiator_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users_friends" ADD "confirmed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_friends" ADD CONSTRAINT "FK_3433a322621967fe462ae9e6a3a" FOREIGN KEY ("initiator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );

    Object.entries(group).map(([key, value]) =>
      value.map(async ({ user_id, friend_id }) => {
        await queryRunner.query(
          `UPDATE "users_friends" SET confirmed = true, initiator_id = $1 WHERE user_id = $2 AND friend_id = $3`,
          [key, user_id, friend_id],
        );
      }),
    );

    await queryRunner.query(`ALTER TABLE "users_friends" ALTER COLUMN "initiator_id" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_friends" DROP CONSTRAINT "FK_3433a322621967fe462ae9e6a3a"`,
    );
    await queryRunner.query(`ALTER TABLE "users_friends" DROP COLUMN "confirmed"`);
    await queryRunner.query(`ALTER TABLE "users_friends" DROP COLUMN "initiator_id"`);
  }
}
