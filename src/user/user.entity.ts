import {Entity, Column, PrimaryGeneratedColumn,PrimaryColumn, OneToMany, ManyToOne} from 'typeorm';
import {ServiceType} from "../timeentrysource/genericTimeEntryInterface";
import {TypeOrmJsonTransformer} from "../lib/typeormjsontransformer";

@Entity()
export class UserEntity {
    @PrimaryColumn()
    id: string

    @OneToMany(() => ServiceEntity, service => service.user, {eager: true, cascade: true})
    services?: ServiceEntity[]

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
