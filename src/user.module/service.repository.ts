import {Inject, Injectable} from '@nestjs/common';
import {POSTGRES_POOL} from "../postgres.module/postgres.module";
import {Pool} from 'pg'
import {fromDatabase, ServiceModel} from "./service.model";

@Injectable()
export class ServiceRepository {
    constructor(@Inject(POSTGRES_POOL) private pool: Pool) {
    }

    async getServicesByUserId(id: string): Promise<ServiceModel[]> {
        const res = await this.pool.query(`SELECT *
                                           FROM services
                                           WHERE userid = $1`, [id])
        return res.rows.map(fromDatabase)
    }

    async getServiceByUserIdAndId(userId: string, id: number): Promise<ServiceModel[]> {
        const res = await this.pool.query(`SELECT *
                                           FROM services
                                           WHERE userid = $1
                                             AND id = $2`, [userId, id])
        return res.rows.map(fromDatabase)
    }

    async addService(service: Omit<ServiceModel,'id'>): Promise<void> {
        const res = await this.pool.query(`INSERT INTO services (type, config, enabled, description, userid)
                                           VALUES ($1, $2, $3, $4,
                                                   $5)`, [service.type, service.config, service.enabled, service.description, service.userId])
    }

    async deleteService(serviceId: number): Promise<void> {
        const res = await this.pool.query(`DELETE FROM services WHERE id = $1`, [serviceId])
    }
}
