import type {DefaultMigrations} from '../migrations'
    ;

export const up: DefaultMigrations = async ({context: client}) => {
    await client.query(`
        CREATE TABLE users
        (
            id               text PRIMARY KEY,
            dailyWorkingTime interval DEFAULT '8 hours',
            description      text NULL
        )`)


    await client.query(`
        CREATE TABLE services
        (
            id          SERIAL PRIMARY KEY,
            type        text NOT NULL,
            config      text NULL,
            enabled     boolean DEFAULT true,
            description text NULL,
            userId      text NOT NULL,
            CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users (id)
        );`)

    await client.query(`
        CREATE TABLE timesheets
        (
            id          text,
            source      text,
            PRIMARY KEY (id, source),
            description text NULL,
            active      boolean GENERATED ALWAYS AS ( "end" IS NULL ) STORED,
            day         date NOT NULL,
            begin       time NOT NULL,
            "end"       time NULL,
            duration    interval GENERATED ALWAYS AS ( "end" - begin ) STORED,
            userId      text NOT NULL,
            CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users (id)
        );`)

    await client.query(`
        CREATE VIEW day AS
        SELECT userid,
               day,
               SUM(duration) as duration,
               SUM(duration)- (SELECT dailyworkingtime from users u WHERE id=timesheets.userid) AS saldo
        FROM timesheets GROUP BY day, userid;
    `)

    await client.query(`
        CREATE VIEW summary AS
        SELECT
            userid,
            SUM(saldo) as saldo,
            SUM(duration) as duration,
            COUNT(*) * (SELECT dailyworkingtime from users where id=userid) as should,
            (SELECT begin FROM timesheets WHERE active=true AND userid=timesheets.userid) as begin
        FROM day GROUP BY userid;
    `)
}

export const down: DefaultMigrations = async ({context: client}) => {
    await client.query('DROP TABLE IF EXISTS services;')
    await client.query('DROP VIEW IF EXISTS summary;')
    await client.query('DROP VIEW IF EXISTS day;')
    await client.query('DROP TABLE IF EXISTS timesheets;')
    await client.query('DROP TABLE IF EXISTS users;')
}
