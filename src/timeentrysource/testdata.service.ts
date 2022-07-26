import {Injectable} from '@nestjs/common';
import {Temporal} from "@js-temporal/polyfill";
import {GenericTimeEntryInterface, ServiceType} from "./genericTimeEntryInterface";
import {TimeEntry} from "./timeentry.entity";

@Injectable()
export class TestDataService implements GenericTimeEntryInterface {

    async getTimeEntries(): Promise<TimeEntry[]> {
        return [
            {
                description: 'Dummy TimeEntry Active',
                sourceType: ServiceType.TESTDATA_SERVICE,
                active: true,
                begin: Temporal.ZonedDateTime.from({year: 2022, month: 1, day: 1, hour: 13, timeZone: 'Europe/Berlin'}),
                sourceId: 'a',
            },
            {
                sourceId: 'b',
                description: 'Dummy TimeEntry Closed',
                sourceType: ServiceType.TESTDATA_SERVICE,
                active: false,
                begin: Temporal.ZonedDateTime.from({year: 2022, month: 1, day: 1, hour: 6, timeZone: 'Europe/Berlin'}),
                end: Temporal.ZonedDateTime.from({year: 2022, month: 1, day: 1, hour: 12, timeZone: 'Europe/Berlin'}),
                duration: Temporal.Duration.from({hours: 6}),
            },
            {
                sourceId: 'c',
                description: 'Dummy TimeEntry Last Year',
                sourceType: ServiceType.TESTDATA_SERVICE,
                active: false,
                begin: Temporal.ZonedDateTime.from({year: 2021, month: 12, day: 31, hour: 6, timeZone: 'Europe/Berlin'}),
                end: Temporal.ZonedDateTime.from({year: 2021, month: 12, day: 31, hour: 14, timeZone: 'Europe/Berlin'}),
                duration: Temporal.Duration.from({hours: 8}),
            },
        ]
    }
}
