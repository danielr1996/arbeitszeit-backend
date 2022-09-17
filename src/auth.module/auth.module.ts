import {Global, Module} from '@nestjs/common';
import {AuthGuard} from "./jwt-auth.guard";
import {UserModule} from "../user.module/user.module";

@Global()
@Module({
    imports: [UserModule],
    providers: [AuthGuard],
    exports: [AuthGuard]
})
export class AuthModule {}
