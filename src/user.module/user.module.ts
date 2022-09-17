import {Module} from '@nestjs/common';
import {UserRepository} from './user.repository';
import {PostgresModule} from "../postgres.module/postgres.module";
import {ServiceRepository} from "./service.repository";
import {ServiceController} from "./service.controller";
import {UserController} from "./user.controller";

@Module({
    imports: [PostgresModule],
    providers: [UserRepository, ServiceRepository],
    exports: [UserRepository, ServiceRepository],
    controllers: [ServiceController, UserController]
})
export class UserModule {
}
