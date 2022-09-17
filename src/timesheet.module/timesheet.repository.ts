import {Inject, Injectable} from '@nestjs/common';
import {POSTGRES_POOL} from "../postgres.module/postgres.module";
import {Pool} from 'pg'
import {fromDatabase, Timesheet} from "../source.module/timesheet.model";
import {Temporal} from "@js-temporal/polyfill";
import {expand} from "../lib/pg";


@Injectable()
export class TimesheetRepository {
    constructor(@Inject(POSTGRES_POOL) private pool: Pool) {
    }

    async addTimesheets(timesheets: (Timesheet & { userId: string })[]): Promise<void> {
        if(timesheets.length === 0){
            return
        }
        const values = timesheets.map(timesheet => [timesheet.id, timesheet.source, timesheet.day, timesheet.begin, timesheet["end"], timesheet.userId, timesheet.description])
        await this.pool.query(` INSERT INTO timesheets (id, source, day, begin, "end", userId, description)
                VALUES
                ${expand(values.length, 7)}
                                    ON CONFLICT (id, source)
                DO UPDATE
                SET day = excluded.day,
                begin
                = excluded.begin,
                                        "end" = excluded.end,
                                        userid = excluded.userId,
                                        description = excluded.description;`,
            values.flat())
    }



    public async removeTimesheetsFromUser(userId): Promise<void>{
        await this.pool.query(`DELETE FROM timesheets WHERE userid = $1`, [userId])
    }
}
