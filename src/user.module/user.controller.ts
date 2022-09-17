import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from "@nestjs/common";
import {UserRepository} from "./user.repository";
import {AuthGuard, Role, Roles} from "../auth.module/jwt-auth.guard";
import {UserModel} from "./user.model";

@Controller('/users/me')
export class UserController {
    constructor(
        private readonly userRepo: UserRepository,
    ) {
    }

    @Get()
    @UseGuards(AuthGuard)
    @Roles(Role.User)
    async getUser(@Req() req: Request): Promise<UserModel> {
        const user = await this.userRepo.getUser(req['userId'])
        return user
    }

    @Put()
    @UseGuards(AuthGuard)
    @Roles(Role.User)
    async updateUser(@Req() req: Request, @Body() user:Pick<UserModel, "dailyWorkingTime">): Promise<void> {
        await this.userRepo.updateUser(req['userId'], user)
    }
}
