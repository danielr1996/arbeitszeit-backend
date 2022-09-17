import {Injectable} from '@nestjs/common';
import {Temporal} from "@js-temporal/polyfill";
import {GenericTimesheetService} from "./genericTimesheetService";
import {Timesheet} from "./timesheet.model";
import {ServiceType} from "../user.module/service.model";

@Injectable()
export class TestDataService implements GenericTimesheetService {
    async getTimesheets(): Promise<Timesheet[]> {
        return [
            {
                id: 'a',
                description: 'Dummy TimeEntry Active',
                source: ServiceType.TESTDATA_SERVICE,
                active: true,
                day: Temporal.PlainDate.from({year: 2022, month: 1, day: 1}),
                begin: Temporal.PlainTime.from({hour: 13,}),
            },
            {
                id: 'b',
                description: 'Dummy TimeEntry Closed',
                source: ServiceType.TESTDATA_SERVICE,
                active: false,
                day: Temporal.PlainDate.from({year: 2022, month: 1, day: 1}),
                begin: Temporal.PlainTime.from({hour: 6,}),
                end: Temporal.PlainTime.from({hour: 12}),
                duration: Temporal.Duration.from({hours: 6}),
            },
            {
                id: 'c',
                description: 'Dummy TimeEntry Last Year',
                source: ServiceType.TESTDATA_SERVICE,
                active: false,
                day: Temporal.PlainDate.from({year: 2021, month: 12, day: 31}),
                begin: Temporal.PlainTime.from({hour: 6,}),
                end: Temporal.PlainTime.from({hour: 14}),
                duration: Temporal.Duration.from({hours: 8}),
            },
        ]
    }
}
