import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards} from "@nestjs/common";
import {UsersService} from "./user.service";
import {AuthGuard, Role, Roles} from "../auth/jwt-auth.guard";
import {ServiceEntity} from "./user.entity";
import {ServicesService} from "./services.service";

@Controller('/users/me/services')
export class ServiceController {
    constructor(
        private readonly userService: UsersService,
        private readonly servicesService: ServicesService,
    ) {
    }

    @Get()
    @UseGuards(AuthGuard)
    async getServices(@Req() req: Request): Promise<ServiceEntity[]> {
        const user = await this.userService.getUser(req['userId'])
        return user.services
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    async getService(@Req() req: Request, @Param("id") id: number): Promise<ServiceEntity> {
        const user = await this.userService.getUser(req['userId'])
        return user.services.filter(({id}) => id === id)[0]
    }

    @Post()
    @UseGuards(AuthGuard)
    async addService(@Req() req: Request, @Body() service: ServiceEntity): Promise<void> {
        const user = await this.userService.getUser(req['userId'])
        user.services.push(service)
        await this.userService.addUser(user)
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    async deleteService(@Req() req: Request, @Param("id") id: string): Promise<any> {
        const user = await this.userService.getUser(req['userId'])
        const service = user.services.filter(({id}) => id === id)[0]
        return await this.servicesService.deleteService(service.id)
        // console.log(typeof id)
        // console.log(user.services.filter(service => service.id !== 1))
        // await this.userService.addUser(user)
    }
}
