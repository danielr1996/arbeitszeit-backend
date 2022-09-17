import {Module} from '@nestjs/common';
import {ClockifyService} from './clockify.service';
import {TestDataService} from "./testdata.service";
import {TimesheetService} from "./timesheet.service";
import {UserModule} from "../user.module/user.module";
import {ServiceType} from "../user.module/service.model";
import {SyncController} from "./sync.controller";
import {TimesheetModule} from "../timesheet.module/timesheet.module";

@Module({
    imports: [UserModule, TimesheetModule],
    providers: [
        {
            provide: ServiceType.CLOCKIFY_SERVICE,
            useClass: ClockifyService,
        },
        {
            provide: ServiceType.TESTDATA_SERVICE,
            useClass: TestDataService,
        },
        TimesheetService
    ],
    exports: [TimesheetService],
    controllers: [SyncController]
})
export class SourceModule {
}
