import {Controller, Get, Headers, Query, Req, UseGuards} from '@nestjs/common';
import {TimeentryService} from "./timeentrysource/timeentry.service";
import {Temporal} from "@js-temporal/polyfill";
import {UsersService} from "./user/user.service";
import Duration = Temporal.Duration;
import {AuthGuard, Role, Roles} from "./auth/jwt-auth.guard";
import {TimeEntry} from "./timeentrysource/timeentry.entity";

export const getStart = (timesheets: TimeEntry[]) => timesheets.slice(-1)[0].begin

export const getEnd = (timesheets: TimeEntry[], remaining: Temporal.Duration) => {
    // @ts-ignore
    let end = timesheets[0].end
    // if (!timesheets[0].active) {
    //     @ts-ignore
    //     end = end.subtract(remaining)
    // }
    return end
}
export const getDuration = (timesheets: TimeEntry[], now: Temporal.ZonedDateTime) =>timesheets
    // @ts-ignore
    .map(t => ({...t, end: t.active ? now : t.end, duration: t.active ? t.begin.until(now) : t.duration}))
    .reduce((sum, timesheet) => sum.add(timesheet.duration), Temporal.Duration.from({hours: 0}))

export const getPercentage = (duration: Temporal.Duration, dailyWorkingTime: Temporal.Duration) => duration?.total('hours') / dailyWorkingTime.total('hours')
export const getRemaining = (duration: Temporal.Duration, dailyWorkingTime: Temporal.Duration) => duration.subtract(dailyWorkingTime)
export const getRemainingWithOvertime = (remaining: Temporal.Duration, overtime: Temporal.Duration) => remaining.add(overtime)
export const getOvertime = (overtime: Temporal.Duration, remaining: Temporal.Duration, duration: Temporal.Duration, dailyWorkingTime: Temporal.Duration) => Temporal.Duration.compare(dailyWorkingTime, duration) <= 0 ? overtime.add(remaining) : overtime

export type TimeSummary = {
    percentage?: number,
    begin?: Temporal.ZonedDateTime,
    end?: Temporal.ZonedDateTime,
    duration?: Temporal.Duration,
    overtime?: Temporal.Duration,
    remaining?: Temporal.Duration,
    remainingWithOvertime?: Temporal.Duration,
}

export const getSummary = (dailyWorkingTime: Temporal.Duration, now: Temporal.ZonedDateTime, overtime: Temporal.Duration, timesheets?: TimeEntry[]): TimeSummary => {
    if (!timesheets || timesheets.length <= 0) {
        return {
            percentage: 1,
            overtime,
        }
    }
    const begin = getStart(timesheets)
    const duration = getDuration(timesheets, now)
    const percentage = getPercentage(duration, dailyWorkingTime)
    const remaining = getRemaining(duration, dailyWorkingTime)
    const end = getEnd(timesheets, remaining)
    const remainingWithOvertime = getRemainingWithOvertime(remaining, overtime)
    overtime = getOvertime(overtime, remaining, duration, dailyWorkingTime)

    return {
        begin,
        end,
        duration,
        percentage,
        remaining,
        remainingWithOvertime,
        overtime,
    }
}

@Controller()
export class AppController {
    constructor(
        private readonly timeEntryService: TimeentryService,
        private readonly userService: UsersService,
    ) {
    }

    @Get('/time/summary')
    @UseGuards(AuthGuard)
    @Roles(Role.User)
    async getTimeSummary(@Req() req: Request): Promise<any> {
        const user = await this.userService.getUser(req['userId'])
        const timeentries = await this.timeEntryService.getTimeEntriesFromUser(user)
        timeentries.sort((a,b)=>Temporal.PlainDateTime.compare(b.begin,a.begin))
        const groupedByDay: { day: Temporal.PlainDate,timeEntries: any[] }[] = Object.values(timeentries.reduce((acc: { [key: string]: { day: Temporal.PlainDate, timeEntries: any[] } }, t) => {
            const key = t.begin.toPlainDate().toString();
            (acc[key] = acc[key] || {day: t.begin.toPlainDate(), timeEntries: []}).timeEntries.push(t)
            return acc
        }, {}))
        const daysWorked = Duration.from({days: groupedByDay.filter(({day})=>day.dayOfWeek !== 7 && day.dayOfWeek !== 6).length})
        const shouldHaveWorked = Duration.from({hours: 7*daysWorked.days})

        const actuallyWorked = timeentries.reduce((sum, timesheet) => sum.add(timesheet.duration || timesheet.begin.until(Temporal.Now.zonedDateTimeISO('Europe/Berlin'))), Temporal.Duration.from({hours: 0}))
        const saldo = actuallyWorked.subtract(shouldHaveWorked)
        const now = Temporal.Now.zonedDateTimeISO()
        const today = groupedByDay.filter(({day})=>!Temporal.PlainDate.compare(day,now.toPlainDate()))
        const summary = getSummary(Temporal.Duration.from({hours: 7}),now,saldo,today.length > 0 ? today[0].timeEntries : [])
        return summary
    }
}
