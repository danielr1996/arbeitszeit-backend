import {Controller, Get, Req, UseGuards} from "@nestjs/common";
import {TimesheetService} from "./timesheet.service";
import {TimesheetRepository} from "../timesheet.module/timesheet.repository";
import {AuthGuard, Role, Roles} from "../auth.module/jwt-auth.guard";

@Controller()
export class SyncController {
    constructor(
        private timesheetService: TimesheetService,
        private timesheetRepo: TimesheetRepository,
    ) {
    }

    @Get('/users/me/sync')
    @UseGuards(AuthGuard)
    @Roles(Role.User)
    async getTimeEntries(@Req() req: Request): Promise<void> {
        await this.timesheetRepo.removeTimesheetsFromUser(req['userId'])
        const timesheets = await this.timesheetService.getTimesheetsFromUser(req['userId'])
        await this.timesheetRepo.addTimesheets(timesheets)
    }
}
