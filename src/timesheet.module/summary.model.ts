import {Temporal} from "@js-temporal/polyfill";

export type SummaryModel = {
    saldo: Temporal.Duration
    duration: Temporal.Duration
    should: Temporal.Duration
}
