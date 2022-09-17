import {Pool} from "pg"
import {JSONStorage, Umzug} from "umzug"
import * as dotenv from 'dotenv'
dotenv.config()
require('ts-node/register')

const commonOptions= {
    context: new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    }),
    storage: new JSONStorage(),
    logger: console,
}
const defaultMigrations = new Umzug({
    ...commonOptions,
    migrations: {glob: 'src/migrations/default/*.migration.ts'},
})
const extraMigrations = new Umzug({
    ...commonOptions,
    migrations: {glob: 'src/migrations/extra/*.migration.ts'},
})
export type DefaultMigrations = typeof defaultMigrations._types.migration;
export type ExtraMigrations = typeof extraMigrations._types.migration;

export const runMigrations = async ()=>{
    await defaultMigrations.up()
}
