import {TimeEntry} from "./timeentry.entity";

export enum ServiceType {
    CLOCKIFY_SERVICE = 'CLOCKIFY_SERVICE',
    TESTDATA_SERVICE = 'TESTDATA_SERVICE',
}

export interface GenericTimeEntryInterface {
    getTimeEntries(config?: {[key in string]: key}): Promise<TimeEntry[]>;
}
