import {Test} from '@nestjs/testing';
import {POSTGRES_POOL, PostgresModule} from "./postgres.module";
import {Pool} from 'pg'

describe('PostgresModule', () => {
    it('should provide a Pool object for injection', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [PostgresModule.forRoot({configFactory: () => ({}), inject: []})]
        }).compile();

        const pool = moduleRef.get<Pool>(POSTGRES_POOL);

        // We can not really check if a pool is correctly instantiated because we have to database to connect to,
        // but if the totalCount is 0 we can assume that we got a pool object from IoC container
        expect(pool.totalCount).toBe(0)
    });
});
