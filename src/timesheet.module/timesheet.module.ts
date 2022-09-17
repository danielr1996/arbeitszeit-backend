import {Module} from "@nestjs/common";
import {PostgresModule} from "../postgres.module/postgres.module";
import {TimesheetRepository} from "./timesheet.repository";
import {SummaryController} from "./summary.controller";
import {SummaryRepository} from "./summary.repository";
import {UserModule} from "../user.module/user.module";

@Module({
    imports: [
        PostgresModule,
        UserModule,
    ],
    providers: [TimesheetRepository, SummaryRepository],
    exports: [TimesheetRepository, SummaryRepository],
    controllers: [SummaryController]
})
export class TimesheetModule {
}
