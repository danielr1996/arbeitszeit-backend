import {Controller, Get, Req, UseGuards} from "@nestjs/common";
import {SummaryRepository} from "./summary.repository";
import {SummaryModel} from "./summary.model";
import {AuthGuard, Role, Roles} from "../auth.module/jwt-auth.guard";

@Controller()
export class SummaryController {
    constructor(
        private summaryrepo: SummaryRepository
    ) {
    }


    @UseGuards(AuthGuard)
    @Roles(Role.User)
    @Get('/users/me/summary')
    async getSummary(@Req() req: Request): Promise<SummaryModel> {
        return this.summaryrepo.getSummary(req['userId'])
    }
}
