import {Pool} from "pg"
import {JSONStorage, Umzug} from "umzug"
import * as dotenv from 'dotenv'
dotenv.config()
import 'ts-node/register'

const commonOptions= {
    context: new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    }),
        storage: {
            async executed({ context: client }) {
                await client.query(`create table if not exists _migrations(name text)`);
                const results = (await client.query(`select name from _migrations`)).rows;
                return results.map((r: { name: string }) => r.name);
            },
            async logMigration({ name, context: client }) {
                await client.query(`insert into _migrations(name) values ($1)`, [name]);
            },
            async unlogMigration({ name, context: client }) {
                await client.query(`delete from _migrations where name = $1`, [name]);
            },
        },
    logger: console,
}
const defaultMigrations = new Umzug({
    ...commonOptions,
    migrations: {glob: 'src/migrations/default/*.migration.ts'},
})

export type DefaultMigrations = typeof defaultMigrations._types.migration;

export const runMigrations = async ()=>{
    await defaultMigrations.up()
}
