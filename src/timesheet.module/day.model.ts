import {Temporal} from "@js-temporal/polyfill";

export type Day = {
    day: Temporal.PlainDate
    userId: string,
    saldo: Temporal.Duration
}
