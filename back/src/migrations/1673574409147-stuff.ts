import { MigrationInterface, QueryRunner } from "typeorm";

export class stuff1673574409147 implements MigrationInterface {
    name = 'stuff1673574409147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."profiles_status_enum" AS ENUM('OFFLINE', 'ONLINE', 'PLAYING')`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" integer NOT NULL, "name" character varying(255) NOT NULL, "nickname" character varying(50) NOT NULL, "avatar_path" character varying(255), "status" "public"."profiles_status_enum" NOT NULL DEFAULT 'OFFLINE', "wins" integer NOT NULL DEFAULT '0', "losses" integer NOT NULL DEFAULT '0', "mmr" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_a53cb2bff1e60b60dc581f86e06" UNIQUE ("nickname"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "banned_users" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "expiration" TIMESTAMP WITH TIME ZONE NOT NULL, "channel_id" integer, CONSTRAINT "PK_51d2f075cd1f44def51dba2a96a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "channel_messages" ("id" SERIAL NOT NULL, "message" text NOT NULL, "user_id" integer, "channel_id" integer, CONSTRAINT "PK_78c08df85633e14659b3bfcd3b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."channels_type_enum" AS ENUM('PUBLIC', 'PRIVATE', 'PROTECTED')`);
        await queryRunner.query(`CREATE TABLE "channels" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "owner_id" integer NOT NULL, "type" "public"."channels_type_enum" NOT NULL DEFAULT 'PUBLIC', "password" character varying(255), CONSTRAINT "PK_bc603823f3f741359c2339389f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer NOT NULL, "login_intra" character varying(20) NOT NULL, "tfa_enabled" boolean NOT NULL DEFAULT false, "tfa_secret" character varying(128), "profile_id" integer, CONSTRAINT "UQ_1ac0a372829d5386c2edeebe8b1" UNIQUE ("login_intra"), CONSTRAINT "REL_23371445bd80cb3e413089551b" UNIQUE ("profile_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "direct_messages" ("id" SERIAL NOT NULL, "message" text NOT NULL, "sender_id" integer, "receiver_id" integer, CONSTRAINT "PK_8373c1bb93939978ef05ae650d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."matches_stage_enum" AS ENUM('AWAITING_PLAYERS', 'PREPARATION', 'ONGOING', 'FINISHED', 'CANCELED')`);
        await queryRunner.query(`CREATE TYPE "public"."matches_type_enum" AS ENUM('CLASSIC', 'TURBO')`);
        await queryRunner.query(`CREATE TABLE "matches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "left_player_score" integer NOT NULL DEFAULT '0', "right_player_score" integer NOT NULL DEFAULT '0', "stage" "public"."matches_stage_enum" NOT NULL DEFAULT 'AWAITING_PLAYERS', "type" "public"."matches_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "left_player_id" integer, "right_player_id" integer, CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "allowed_users" ("channelsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_58990e564a7fc98d28a80477f21" PRIMARY KEY ("channelsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4474d8b7afbb9f1ae5d2f6791f" ON "allowed_users" ("channelsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d750996c1f631b2a2af026cad" ON "allowed_users" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "channel_members" ("channelsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_fbd6a19f4222b6f5103f38ff9e7" PRIMARY KEY ("channelsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0abb6cebfd71cf3c594a9d1db4" ON "channel_members" ("channelsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_aed1f7d335ec0b8deb48a6345b" ON "channel_members" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "channel_admins" ("channelsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_fcf9e37271de28bfb644106d54c" PRIMARY KEY ("channelsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7f5ae58f78d70c741185ba7ee3" ON "channel_admins" ("channelsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4bcfef883b5d0fe085f10d18f4" ON "channel_admins" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "blocked" ("usersId_1" integer NOT NULL, "usersId_2" integer NOT NULL, CONSTRAINT "PK_b6a89cd494058485966d408291f" PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_53170bd39182ed2e52a826e119" ON "blocked" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_7a0c48d75b77a6d0bed66981d1" ON "blocked" ("usersId_2") `);
        await queryRunner.query(`CREATE TABLE "friend_requests" ("usersId_1" integer NOT NULL, "usersId_2" integer NOT NULL, CONSTRAINT "PK_39dff232d5ea2f07285330093cc" PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_30c32098ad59386d24d09ef2a5" ON "friend_requests" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_08a93c90f45e7d7103554f0208" ON "friend_requests" ("usersId_2") `);
        await queryRunner.query(`CREATE TABLE "friendships" ("usersId_1" integer NOT NULL, "usersId_2" integer NOT NULL, CONSTRAINT "PK_743fc9e084f70d2e86c9f5bb389" PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cf91c526fd5896f37f9320b55e" ON "friendships" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_2e01dc7535d12a75f27a827194" ON "friendships" ("usersId_2") `);
        await queryRunner.query(`ALTER TABLE "banned_users" ADD CONSTRAINT "FK_0d3975c618e8bfa68914c984dd8" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_messages" ADD CONSTRAINT "FK_b5b3916651bb72f41942255b1e9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "channel_messages" ADD CONSTRAINT "FK_1fe2ce70d148150a26b64cf1cad" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "direct_messages" ADD CONSTRAINT "FK_867d7903affb6b677ca85674050" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "direct_messages" ADD CONSTRAINT "FK_334926b8a9956b0dec331d960bd" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_284c5e2da31b79dc4f1d1053c47" FOREIGN KEY ("left_player_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_7f5b61505feb87662b27d020339" FOREIGN KEY ("right_player_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "allowed_users" ADD CONSTRAINT "FK_4474d8b7afbb9f1ae5d2f6791f9" FOREIGN KEY ("channelsId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "allowed_users" ADD CONSTRAINT "FK_0d750996c1f631b2a2af026cad7" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "channel_members" ADD CONSTRAINT "FK_0abb6cebfd71cf3c594a9d1db44" FOREIGN KEY ("channelsId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "channel_members" ADD CONSTRAINT "FK_aed1f7d335ec0b8deb48a6345b4" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "channel_admins" ADD CONSTRAINT "FK_7f5ae58f78d70c741185ba7ee30" FOREIGN KEY ("channelsId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "channel_admins" ADD CONSTRAINT "FK_4bcfef883b5d0fe085f10d18f44" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blocked" ADD CONSTRAINT "FK_53170bd39182ed2e52a826e1194" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blocked" ADD CONSTRAINT "FK_7a0c48d75b77a6d0bed66981d1d" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_30c32098ad59386d24d09ef2a55" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_08a93c90f45e7d7103554f0208f" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "friendships" ADD CONSTRAINT "FK_cf91c526fd5896f37f9320b55e9" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "friendships" ADD CONSTRAINT "FK_2e01dc7535d12a75f27a827194b" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friendships" DROP CONSTRAINT "FK_2e01dc7535d12a75f27a827194b"`);
        await queryRunner.query(`ALTER TABLE "friendships" DROP CONSTRAINT "FK_cf91c526fd5896f37f9320b55e9"`);
        await queryRunner.query(`ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_08a93c90f45e7d7103554f0208f"`);
        await queryRunner.query(`ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_30c32098ad59386d24d09ef2a55"`);
        await queryRunner.query(`ALTER TABLE "blocked" DROP CONSTRAINT "FK_7a0c48d75b77a6d0bed66981d1d"`);
        await queryRunner.query(`ALTER TABLE "blocked" DROP CONSTRAINT "FK_53170bd39182ed2e52a826e1194"`);
        await queryRunner.query(`ALTER TABLE "channel_admins" DROP CONSTRAINT "FK_4bcfef883b5d0fe085f10d18f44"`);
        await queryRunner.query(`ALTER TABLE "channel_admins" DROP CONSTRAINT "FK_7f5ae58f78d70c741185ba7ee30"`);
        await queryRunner.query(`ALTER TABLE "channel_members" DROP CONSTRAINT "FK_aed1f7d335ec0b8deb48a6345b4"`);
        await queryRunner.query(`ALTER TABLE "channel_members" DROP CONSTRAINT "FK_0abb6cebfd71cf3c594a9d1db44"`);
        await queryRunner.query(`ALTER TABLE "allowed_users" DROP CONSTRAINT "FK_0d750996c1f631b2a2af026cad7"`);
        await queryRunner.query(`ALTER TABLE "allowed_users" DROP CONSTRAINT "FK_4474d8b7afbb9f1ae5d2f6791f9"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_7f5b61505feb87662b27d020339"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_284c5e2da31b79dc4f1d1053c47"`);
        await queryRunner.query(`ALTER TABLE "direct_messages" DROP CONSTRAINT "FK_334926b8a9956b0dec331d960bd"`);
        await queryRunner.query(`ALTER TABLE "direct_messages" DROP CONSTRAINT "FK_867d7903affb6b677ca85674050"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`ALTER TABLE "channel_messages" DROP CONSTRAINT "FK_1fe2ce70d148150a26b64cf1cad"`);
        await queryRunner.query(`ALTER TABLE "channel_messages" DROP CONSTRAINT "FK_b5b3916651bb72f41942255b1e9"`);
        await queryRunner.query(`ALTER TABLE "banned_users" DROP CONSTRAINT "FK_0d3975c618e8bfa68914c984dd8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2e01dc7535d12a75f27a827194"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cf91c526fd5896f37f9320b55e"`);
        await queryRunner.query(`DROP TABLE "friendships"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08a93c90f45e7d7103554f0208"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_30c32098ad59386d24d09ef2a5"`);
        await queryRunner.query(`DROP TABLE "friend_requests"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7a0c48d75b77a6d0bed66981d1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_53170bd39182ed2e52a826e119"`);
        await queryRunner.query(`DROP TABLE "blocked"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4bcfef883b5d0fe085f10d18f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7f5ae58f78d70c741185ba7ee3"`);
        await queryRunner.query(`DROP TABLE "channel_admins"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aed1f7d335ec0b8deb48a6345b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0abb6cebfd71cf3c594a9d1db4"`);
        await queryRunner.query(`DROP TABLE "channel_members"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d750996c1f631b2a2af026cad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4474d8b7afbb9f1ae5d2f6791f"`);
        await queryRunner.query(`DROP TABLE "allowed_users"`);
        await queryRunner.query(`DROP TABLE "matches"`);
        await queryRunner.query(`DROP TYPE "public"."matches_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."matches_stage_enum"`);
        await queryRunner.query(`DROP TABLE "direct_messages"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "channels"`);
        await queryRunner.query(`DROP TYPE "public"."channels_type_enum"`);
        await queryRunner.query(`DROP TABLE "channel_messages"`);
        await queryRunner.query(`DROP TABLE "banned_users"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TYPE "public"."profiles_status_enum"`);
    }

}
