import {Pool} from "pg"
import {JSONStorage, Umzug} from "umzug"
require('ts-node/register')

const commonOptions= {
    context: new Pool({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        database: 'postgres',
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
