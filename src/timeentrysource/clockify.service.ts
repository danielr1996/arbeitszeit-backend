import {Injectable} from '@nestjs/common';
import {Temporal} from "@js-temporal/polyfill";
import {GenericTimeEntryInterface, ServiceType} from "./genericTimeEntryInterface";
import {TimeEntry} from "./timeentry.entity";

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
export class ClockifyService implements GenericTimeEntryInterface {

    private static async getUser(token: string): Promise<ClockifyUser> {
        const res = await fetch('https://api.clockify.me/api/v1/user', {headers: {'X-API-KEY': token}})
        return await res.json()
    }

    async getTimeEntries(config: ClockifyConfig): Promise<TimeEntry[]> {
        if (!config.token) {
            throw new Error('ConfigError: missing config key \'token\'')
        }
        const {token} = config
        const user = await ClockifyService.getUser(token)
        const res = await fetch(`https://api.clockify.me/api/v1/workspaces/${user.activeWorkspace}/user/${user.id}/time-entries?page-size=5000`, {headers: {'X-API-KEY': token}})
        const timeentries: ClockifyTimeEntry[] = await res.json()
        return timeentries.map(t => ({
            sourceType: ServiceType.CLOCKIFY_SERVICE,
            sourceId: t.id,
            description: t.description,
            active: !t.timeInterval.end,
            begin: Temporal.Instant.from(t.timeInterval.start).toZonedDateTimeISO(user.settings.timeZone),
            end: t.timeInterval.end ? Temporal.Instant.from(t.timeInterval.end).toZonedDateTimeISO(user.settings.timeZone) : undefined,
            duration: t.timeInterval.duration ? Temporal.Duration.from(t.timeInterval.duration) : undefined
        }))
    }
}
