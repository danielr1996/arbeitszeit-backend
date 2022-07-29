import {Module} from '@nestjs/common';
import {AuthGuard} from "./jwt-auth.guard";
import {UserModule} from "../user/user.module";

@Module({
    imports: [UserModule],
    providers: [AuthGuard],
    exports: [AuthGuard]
})
export class AuthModule {}
