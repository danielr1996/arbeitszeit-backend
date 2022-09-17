import {AppController} from "./app.controller";
import {Module} from "@nestjs/common";
import {UserModule} from "./user.module/user.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {PostgresModule} from "./postgres.module/postgres.module";
import {TimesheetService} from "./source.module/timesheet.service";
import {SourceModule} from "./source.module/source.module";
import {TimesheetModule} from "./timesheet.module/timesheet.module";
import {AuthModule} from "./auth.module/auth.module";

@Module({
    imports: [
        SourceModule,
        AuthModule,
        TimesheetModule,
        ConfigModule.forRoot({isGlobal: true}),
        PostgresModule.forRoot({
            configFactory: (configService: ConfigService) => ({
                host: configService.get('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                user: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
            }),
            inject: [ConfigService],
        }),
        UserModule
    ],
    controllers: [AppController],
})
export class AppModule {
}
