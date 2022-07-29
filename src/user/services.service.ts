import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ServiceEntity, UserEntity} from "./user.entity";
import { Repository } from 'typeorm';

@Injectable()
export class ServicesService {
    constructor(@InjectRepository(ServiceEntity) private readonly serviceRepository: Repository<ServiceEntity>) {
    }

    async deleteService(id: number): Promise<any> {
        return await this.serviceRepository.delete({id})
    }
}
