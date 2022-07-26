import {Controller, Get, Query} from '@nestjs/common';
import {TimeentryService} from "./timeentrysource/timeentry.service";
import {Temporal} from "@js-temporal/polyfill";
import {UsersService} from "./user/user.service";
import Duration = Temporal.Duration;

@Controller()
export class AppController {
    constructor(
        private readonly timeEntryService: TimeentryService,
        private readonly userService: UsersService,
    ) {
    }

    @Get()
    async getHello(@Query('user') id): Promise<any> {
        const user = await this.userService.getUser(id)
        const timeentries = await this.timeEntryService.getTimeEntriesFromUser(user)
        const groupedByDay: { day: Temporal.PlainDate,timeEntries: any[] }[] = Object.values(timeentries.reduce((acc: { [key: string]: { day: Temporal.PlainDate, timeEntries: any[] } }, t) => {
            const key = t.begin.toPlainDate().toString();
            (acc[key] = acc[key] || {day: t.begin.toPlainDate(), timeEntries: []}).timeEntries.push(t)
            return acc
        }, {}))
        const daysWorked = Duration.from({days: groupedByDay.filter(({day})=>day.dayOfWeek !== 7 && day.dayOfWeek !== 6).length})
        const shouldHaveWorked = Duration.from({hours: 7*daysWorked.days})
        const actuallyWorked = timeentries.reduce((sum, timesheet) => sum.add(timesheet.duration || timesheet.begin.until(Temporal.Now.zonedDateTimeISO('Europe/Berlin'))), Temporal.Duration.from({hours: 0}))
        const saldo = actuallyWorked.subtract(shouldHaveWorked)
        return {
            daysWorked, shouldHaveWorked, actuallyWorked, saldo
        }
    }
}