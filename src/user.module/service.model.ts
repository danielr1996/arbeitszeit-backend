import {UserModel} from "./user.model";

export type ServiceModel = {
    id: number
    config: ServiceConfig | null
    enabled: boolean
    description: string | null
    userId: string,
    type: ServiceType

}

export enum ServiceType {
    CLOCKIFY_SERVICE = 'CLOCKIFY_SERVICE',
    TESTDATA_SERVICE = 'TESTDATA_SERVICE',
}

type ServiceConfig = {
    [key in string]: string
}
export const fromDatabase: (row: any)=>ServiceModel = (row) =>{
    return {
        id: row['id'],
        description: row['description'],
        type: row['type'],
        config: JSON.parse(row['config']),
        enabled: row['enabled'],
        userId: row['userId'],
    }
}

export const toDatabase: (userModel: UserModel)=>any = (model)=>{
    return {

    }
}
