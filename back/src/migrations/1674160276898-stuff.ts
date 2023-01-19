import { MigrationInterface, QueryRunner } from "typeorm";

export class stuff1674160276898 implements MigrationInterface {
    name = 'stuff1674160276898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "UQ_a53cb2bff1e60b60dc581f86e06"`);
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "mmr" SET DEFAULT '1000'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "mmr" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "UQ_a53cb2bff1e60b60dc581f86e06" UNIQUE ("nickname")`);
    }

}
