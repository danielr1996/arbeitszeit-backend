import {Temporal} from "@js-temporal/polyfill";
import {fromPostgresInterval} from "./temporal";

describe('fromPostgresInterval',()=>{
    it('should return a positiv Duration', ()=>{
        const actual = fromPostgresInterval({hours: 3, minutes: 5})
        const expected = Temporal.Duration.from({hours: 3, minutes: 5})

        expect(Temporal.Duration.compare(actual, expected)).toBe(0)
    })

    it('should return a negative Duration', ()=>{
        const actual = fromPostgresInterval({hours: -1, minutes: -30})
        const expected = Temporal.Duration.from({hours: -1, minutes: -30})

        expect(Temporal.Duration.compare(actual, expected)).toBe(0)
    })

    it('should return a zero Duration', ()=>{
        const actual = fromPostgresInterval({})
        const expected = Temporal.Duration.from({hours: 0})

        expect(Temporal.Duration.compare(actual, expected)).toBe(0)
    })

    it('should return a null for an invalid interval', ()=>{
        const actual = fromPostgresInterval({bogus: 3})

        expect(actual).toBeNull()
    })
})
