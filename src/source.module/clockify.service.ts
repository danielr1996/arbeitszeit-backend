import {Injectable} from '@nestjs/common';
import {Temporal} from "@js-temporal/polyfill";
import {GenericTimesheetService} from "./genericTimesheetService";
import {Timesheet} from "./timesheet.model";
import {ServiceType} from "../user.module/service.model";

type ClockifyUser = {
    id: string,
    email: string,
    name: string,
    activeWorkspace: string,
    defaultWorkspace: string,
    settings: {
        weekstart: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
        timeZone: string,
    }
}

type ClockifyTimeEntry = {
    id: string,
    description: string,
    timeInterval: {
        start: string,
        end?: string,
        duration?: string
    },
}

type ClockifyConfig = {
    token: string
}

@Injectable()
export class ClockifyService implements GenericTimesheetService {

    private static async getUser(token: string): Promise<ClockifyUser> {
        const res = await fetch('https://api.clockify.me/api/v1/user', {headers: {'X-API-KEY': token}})
        return await res.json()
    }

    async getTimesheetsForPage(config: ClockifyConfig, page: number, pagesize: number): Promise<Timesheet[]> {
        if (!config.token) {
            throw new Error('ConfigError: missing config key \'token\'')
        }
        const {token} = config
        const user = await ClockifyService.getUser(token)
        const res = await fetch(`https://api.clockify.me/api/v1/workspaces/${user.activeWorkspace}/user/${user.id}/time-entries?page-size=${pagesize}&page=${page}`, {headers: {'X-API-KEY': token}})
        if(!res.ok){
            console.error(await res.text())
        }
        const timeentries: ClockifyTimeEntry[] = await res.json()
        return timeentries.map(t => ({
            source: ServiceType.CLOCKIFY_SERVICE,
            id: t.id,
            description: t.description,
            active: !t.timeInterval.end,
            day: Temporal.Instant.from(t.timeInterval.start).toZonedDateTimeISO(user.settings.timeZone).toPlainDate(),
            begin: Temporal.Instant.from(t.timeInterval.start).toZonedDateTimeISO(user.settings.timeZone).toPlainTime(),
            end: t.timeInterval.end ? Temporal.Instant.from(t.timeInterval.end).toZonedDateTimeISO(user.settings.timeZone).toPlainTime() : undefined,
            duration: t.timeInterval.duration ? Temporal.Duration.from(t.timeInterval.duration) : undefined
        }))
    }

    async getTimesheets(config: ClockifyConfig): Promise<Timesheet[]>{
        let timeentries = []
        const pagesize = 5000
        let shouldfetch = true
        for(let page = 1;shouldfetch; page++){
            const currentTimeentries = await this.getTimesheetsForPage(config,page, pagesize)
            timeentries =  timeentries.concat(currentTimeentries)
            shouldfetch = currentTimeentries.length >0
        }
        return timeentries
    }
}
