import {Temporal} from "@js-temporal/polyfill";
import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {ServiceType} from "./genericTimeEntryInterface";
import {TypeOrmJsonTransformer} from "../lib/typeormjsontransformer";
import {UserEntity} from "../user/user.entity";

type ActiveTimeEntry = {
    active: true
}

type ClosedTimeEntry = {
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

@Entity()
export class DayEntryEntity{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => UserEntity, user => user.dayEntries )
    user?: UserEntity

    @Column({type: 'text',nullable: true,transformer:TypeOrmJsonTransformer})
    duration?: Temporal.Duration

    @Column({type: 'text',nullable: true,transformer:TypeOrmJsonTransformer})
    totalSaldo?: Temporal.Duration

    @Column({type: 'text',nullable: true,transformer:TypeOrmJsonTransformer})
    dailySaldo?: Temporal.Duration

    @OneToMany(() => TimeEntryEntity, day => day.day)
    timeEntries: TimeEntryEntity[]
}

@Entity()
export class TimeEntryEntity{
    @PrimaryColumn()
    sourceType: ServiceType

    @PrimaryColumn()
    sourceId: string

    @ManyToOne(()=>DayEntryEntity, day=>day.timeEntries)
    day?: DayEntryEntity

    @Column()
    description: string

    @Column()
    active: boolean

    @Column({type: 'text',transformer:TypeOrmJsonTransformer})
    begin: Temporal.ZonedDateTime

    @Column({type: 'text',nullable: true,transformer:TypeOrmJsonTransformer})
    end?: Temporal.ZonedDateTime

    @Column({type: 'text',nullable: true,transformer:TypeOrmJsonTransformer})
    duration?: Temporal.Duration
}
