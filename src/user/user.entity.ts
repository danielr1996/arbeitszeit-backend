import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm';
import {ServiceType} from "../timeentrysource/genericTimeEntryInterface";
import {TypeOrmJsonTransformer} from "../lib/typeormjsontransformer";
import {DayEntryEntity} from "../timeentrysource/timeentry.entity";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    name: string

    @OneToMany(() => ServiceEntity, service => service.user, {eager: true, cascade: true})
    services: ServiceEntity[]

    @OneToMany(()=>DayEntryEntity, timeentry=>timeentry.user)
    dayEntries: DayEntryEntity[]
}


@Entity()
export class ServiceEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => UserEntity, user => user.services)
    user?: UserEntity

    @Column({type: 'text'})
    type: ServiceType;

    @Column({type: 'text', nullable: true, transformer: TypeOrmJsonTransformer})
    config?: { [key in string]: string }
}
