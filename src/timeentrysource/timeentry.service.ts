import {Injectable} from "@nestjs/common";
import {GenericTimeEntryInterface} from "./genericTimeEntryInterface";
import {ModuleRef} from "@nestjs/core";
import {UsersService} from "../user/user.service";
import {UserEntity} from "../user/user.entity";

@Injectable()
export class TimeentryService{
    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly userService: UsersService,
        ) {
    }

    private async getTimeEntriesFromService(service: any): Promise<any[]>{
        return await (this.moduleRef.get(service.type) as GenericTimeEntryInterface).getTimeEntries(service.config)
    }

    public async getTimeEntriesFromUser(user: UserEntity): Promise<any>{
        const all = (await Promise.all(user.services.map(service=>this.getTimeEntriesFromService(service)))).flat().map(t=>({...t, userId: user.id}))
        return all
    }
}
