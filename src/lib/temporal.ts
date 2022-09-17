import {Temporal} from "@js-temporal/polyfill";

export const fromPostgresInterval: (interval: any)=> Temporal.Duration = (interval)=>{
    if(Object.keys(interval).length === 0){
        return Temporal.Duration.from({hours: 0})
    }
    try{
        return Temporal.Duration.from(interval)
    }catch (e){
        return null
    }
}
