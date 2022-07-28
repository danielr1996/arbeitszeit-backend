import {Module} from '@nestjs/common';
import {AuthGuard} from "./jwt-auth.guard";

@Module({
    providers: [AuthGuard],
    exports: [AuthGuard]
})
export class AuthModule {}
