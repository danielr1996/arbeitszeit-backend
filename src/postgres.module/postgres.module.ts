import {DynamicModule, Global, Module} from "@nestjs/common";
import {Pool} from 'pg'
import {InjectionToken} from "@nestjs/common/interfaces/modules/injection-token.interface";
import {OptionalFactoryDependency} from "@nestjs/common/interfaces/modules/optional-factory-dependency.interface";

export const POSTGRES_POOL = Symbol('POSTGRES_PROVIDER')

type DatabaseModuleOptions = {
    configFactory: (deps: any) => { [key in string]: string | number }
    inject: Array<InjectionToken | OptionalFactoryDependency>
}

@Global()
@Module({})
export class PostgresModule {
    static forRoot(options: DatabaseModuleOptions): DynamicModule {
        return {
            module: PostgresModule,
            providers: [
                {
                    provide: POSTGRES_POOL,
                    useFactory: (deps) => new Pool(options.configFactory(deps)),
                    inject: options.inject
                }
            ],
            exports: [POSTGRES_POOL],
        }
    }
}
