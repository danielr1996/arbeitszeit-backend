import {Inject, Injectable} from '@nestjs/common';
import {fromDatabase, UserModel} from "./user.model";
import {POSTGRES_POOL} from "../postgres.module/postgres.module";
import {Pool} from 'pg'

@Injectable()
export class UserRepository {
    constructor(@Inject(POSTGRES_POOL) private pool: Pool) {
    }

    async getUser(id: string): Promise<UserModel> {
        const res = await this.pool.query(`SELECT *
                                           FROM users
                                           WHERE id = $1`, [id])
        return res.rows.map(fromDatabase)[0]
    }

    async addUser(user: Pick<UserModel, 'id'>): Promise<void> {
        const res = await this.pool.query(`INSERT INTO users (id)
                                           VALUES ($1)`, [user.id])
    }

    async updateUser(userId, user: Pick<UserModel, 'dailyWorkingTime'>): Promise<void> {
        const res = await this.pool.query(`UPDATE users SET dailyworkingtime = $1 WHERE id=$2`, [user.dailyWorkingTime, userId])
    }
}
