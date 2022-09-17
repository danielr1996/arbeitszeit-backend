import {Temporal} from "@js-temporal/polyfill";

export type UserModel = {
    id: string,
    description: string | null,
    dailyWorkingTime: Temporal.Duration
}

export const fromDatabase: (row: any)=>UserModel = (row) =>{
    return {
        id: row['id'],
        description: row['description'],
        dailyWorkingTime: Temporal.Duration.from(row['dailyworkingtime'])
    }
}

export const toDatabase: (userModel: UserModel)=>any = (model)=>{
    return {

    }
}
