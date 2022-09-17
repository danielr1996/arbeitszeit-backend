import {Timesheet} from "./timesheet.model";

export interface GenericTimesheetService {
    getTimesheets(config?: {[key in string]: key}): Promise<Timesheet[]>;
}
