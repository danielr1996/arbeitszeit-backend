import {Injectable} from "@nestjs/common";
import {ModuleRef} from "@nestjs/core";
import {Timesheet} from "./timesheet.model";
import {GenericTimesheetService} from "./genericTimesheetService";
import {ServiceModel} from "../user.module/service.model";
import {ServiceRepository} from "../user.module/service.repository";

@Injectable()
export class TimesheetService {
    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly serviceRepo: ServiceRepository,
    ) {
    }
    public async getTimesheetsFromService(service: ServiceModel): Promise<Timesheet[]>{
        const serviceInstance = this.moduleRef.get(service.type) as GenericTimesheetService
        return await serviceInstance.getTimesheets(service.config)
    }

    public async getTimesheetsFromUser(userId): Promise<(Timesheet & {userId: string})[]>{
        const services = (await this.serviceRepo.getServicesByUserId(userId)).filter(({enabled})=>enabled)
        return (await Promise.all(services.map(service=>this.getTimesheetsFromService(service)))).flat().map(t=>({...t, userId}))
    }
}
