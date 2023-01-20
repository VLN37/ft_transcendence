import { MigrationInterface, QueryRunner } from "typeorm";

export class stuff1674240435402 implements MigrationInterface {
    name = 'stuff1674240435402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "nickname"`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "nickname" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_1ac0a372829d5386c2edeebe8b1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "login_intra"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "login_intra" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_1ac0a372829d5386c2edeebe8b1" UNIQUE ("login_intra")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_1ac0a372829d5386c2edeebe8b1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "login_intra"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "login_intra" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_1ac0a372829d5386c2edeebe8b1" UNIQUE ("login_intra")`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "nickname"`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "nickname" character varying(50) NOT NULL`);
    }

}
