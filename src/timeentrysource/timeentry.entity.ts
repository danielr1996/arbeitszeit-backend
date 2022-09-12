import {Temporal} from "@js-temporal/polyfill";
import {ServiceType} from "./genericTimeEntryInterface";

export type ActiveTimeEntry = {
    active: true
}

export type ClosedTimeEntry = {
    active: false
    end: Temporal.ZonedDateTime,
    duration: Temporal.Duration,
}

export type TimeEntry = {
    sourceId: string
    sourceType: ServiceType
    description: string
    begin: Temporal.ZonedDateTime,
    totalSaldo?: Temporal.Duration
    dailySaldo?: Temporal.Duration
} & (ActiveTimeEntry | ClosedTimeEntry)
