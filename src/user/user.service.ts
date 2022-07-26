import {Injectable} from '@nestjs/common';
import {ServiceType} from "../timeentrysource/genericTimeEntryInterface";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import { Repository } from 'typeorm';

// export type User = {
//     id: number,
//     name: string,
//     services: {
//         type: ServiceType
//         config?: { [key in string]: string }
//     }[]
// }


@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
    }

    async getUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find()
    }

    async getUser(id: number): Promise<UserEntity> {
        return await this.userRepository.findOneBy({id})
    }
}
