import {Module} from '@nestjs/common';
import {ClockifyService} from './clockify.service';
import {TestDataService} from "./testdata.service";
import {TimeentryService} from "./timeentry.service";
import {ServiceType} from "./genericTimeEntryInterface";
import {UserModule} from "../user/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DayEntryEntity, TimeEntryEntity} from "./timeentry.entity";

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([TimeEntryEntity, DayEntryEntity])],
    providers: [
        {
            provide: ServiceType.CLOCKIFY_SERVICE,
            useClass: ClockifyService,
        },
        {
            provide: ServiceType.TESTDATA_SERVICE,
            useClass: TestDataService,
        },
        TimeentryService],
    exports: [TimeentryService]
})
export class TimeEntrySourceModule {
}