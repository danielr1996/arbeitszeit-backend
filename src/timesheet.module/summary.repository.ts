import {Inject, Injectable} from '@nestjs/common';
import {POSTGRES_POOL} from "../postgres.module/postgres.module";
import {Pool} from 'pg'
import {SummaryModel} from "./summary.model";
import {fromPostgresInterval} from "../lib/temporal";


@Injectable()
export class SummaryRepository {
    constructor(@Inject(POSTGRES_POOL) private pool: Pool) {
    }

    async getSummary(userId: string): Promise<SummaryModel> {
        const res = await this.pool.query(`SELECT * FROM summary WHERE userid = $1`, [userId])
        if(res.rows.length === 0){
            return null
        }
        const summary = res.rows[0]
        return {
            ...summary,
            saldo: fromPostgresInterval(summary.saldo),
            duration: fromPostgresInterval(summary.duration),
            should: fromPostgresInterval(summary.should),
        }
    }

}
