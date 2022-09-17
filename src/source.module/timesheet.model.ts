import {Temporal} from "@js-temporal/polyfill";
import {ServiceType} from "../user.module/service.model";
import {TimesheetRepository} from "../timesheet.module/timesheet.repository";

export type ActiveTimesheet = {
    active: true
} & BasicTimesheet

export type ClosedTimesheet = {
    active: false
    end: Temporal.PlainTime,
    duration: Temporal.Duration,
} & BasicTimesheet

type BasicTimesheet = {
    id: string
    active: boolean
    source: ServiceType
    description: string
    begin: Temporal.PlainTime,
    day: Temporal.PlainDate,
}

export type Timesheet = ActiveTimesheet | ClosedTimesheet



export const fromDatabase: (row:any)=>Timesheet = (row)=>{
    const date = row['day'] as Date        //@ts-ignore
    const day = date.toTemporalInstant().toZonedDateTimeISO(Temporal.Now.timeZone()).toPlainDate()
    const begin = Temporal.PlainTime.from(row['begin'])
    const end = row['end'] ? Temporal.PlainTime.from(row['end']) : null
    const duration = row['duration'] ? Temporal.Duration.from(row['duration']) : null
    return {
        ...row,
        day,
        begin,
        end,
        duration
    }
}
// export const fromDatabase: (row:any)=>Timesheet = (row)=>{
//     const date = row['day'] as Date        //@ts-ignore
//     const day = date.toTemporalInstant().toZonedDateTimeISO(Temporal.Now.timeZone()).toPlainDate()
//     const begin = Temporal.PlainTime.from(row['begin'])
//     const end = row['end'] ? Temporal.PlainTime.from(row['end']) : null
//     const duration = row['duration'] ? Temporal.Duration.from(row['duration']) : null
//     return {
//         ...row,
//         day,
//         begin,
//         end,
//         duration
//     }
// }
