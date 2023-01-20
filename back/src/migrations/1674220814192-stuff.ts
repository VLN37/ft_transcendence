import { MigrationInterface, QueryRunner } from "typeorm";

export class stuff1674220814192 implements MigrationInterface {
    name = 'stuff1674220814192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matches" ADD "starts_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "matches" ADD "ends_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "ends_at"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP COLUMN "starts_at"`);
    }
}
