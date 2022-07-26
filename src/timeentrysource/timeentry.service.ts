import {Injectable} from "@nestjs/common";
import {GenericTimeEntryInterface} from "./genericTimeEntryInterface";
import {ModuleRef} from "@nestjs/core";
import {UsersService} from "../user/user.service";
import {UserEntity} from "../user/user.entity";
import {DayEntryEntity, TimeEntry, TimeEntryEntity} from "./timeentry.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

// export type User = { userId: number, timeEntries: TimeEntry[] }

@Injectable()
export class TimeentryService{
    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly userService: UsersService,
        @InjectRepository(TimeEntryEntity) private readonly timeEntryEntityRepository: Repository<TimeEntryEntity>,
        @InjectRepository(DayEntryEntity) private readonly dayService: Repository<DayEntryEntity>,
        ) {
    }

    private async getTimeEntriesFromService(service: any): Promise<any[]>{
        return await (this.moduleRef.get(service.type) as GenericTimeEntryInterface).getTimeEntries(service.config)
    }

    public async getTimeEntriesFromUser(user: UserEntity): Promise<any>{
        const all = (await Promise.all(user.services.map(service=>this.getTimeEntriesFromService(service)))).flat().map(t=>({...t, userId: user.id}))
        return all
    }

    async fetchTimeEntries() {
        const users = await this.userService.getUsers()
        const all = (await Promise.all(users.map(user=>this.getTimeEntriesFromUser(user)))).flat()
        // await this.dayService.save(all)
        // all.forEach(user=>{
        //
        //     user.timeEntries
        //         .forEach(timeEntry=>this.timeEntryEntityRepository.save({...timeEntry, user: {id: user.userId}}))
        // })
        return all

    }

    async getTimeEntries(): Promise<any>{
        return this.timeEntryEntityRepository.find()
    }

    async saveTimeEntries(timeEntries: TimeEntry[]): Promise<any>{
        return this.timeEntryEntityRepository.save(timeEntries)
    }
}
