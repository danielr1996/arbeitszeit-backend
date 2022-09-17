import {ExtraMigrations} from "../migrations";

export const up: ExtraMigrations = async ({context: client}) => {
    await client.query(`
        INSERT INTO users (id, description, dailyworkingtime)
        VALUES ('2', 'John Doe', '8 hours') ON CONFLICT DO NOTHING ;

        INSERT INTO timesheets (id, source, description, day, begin, "end", userId)
        VALUES (1, '', '', '2020-01-01', '08:00', '16:00', '2'),
               (2, '', '', '2020-01-02', '08:00', '12:00', '2'),
               (3, '', '', '2020-01-02', '13:00', '15:00', '2') ON CONFLICT DO NOTHING 
    `)
}

export const down: ExtraMigrations = async ({context: client}) => {
    await client.query(`
        DELETE
        FROM users
        WHERE id = '1'
           OR id = '2';
        DELETE
        FROM services
        WHERE userid = '1'
           OR userid = '2';
        DELETE
        FROM timesheets
        WHERE userid = '1'
           OR userid = '2';
    `)
}
