import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards} from "@nestjs/common";
import {UserRepository} from "./user.repository";
import {ServiceRepository} from "./service.repository";
import {AuthGuard, Role, Roles} from "../auth.module/jwt-auth.guard";
import {ServiceModel} from "./service.model";

@Controller('/users/me/services')
export class ServiceController {
    constructor(
        private readonly serviceRepo: ServiceRepository,
    ) {
    }

    @Get()
    @UseGuards(AuthGuard)
    @Roles(Role.User)
    async getServices(@Req() req: Request): Promise<ServiceModel[]> {
        const services = await this.serviceRepo.getServicesByUserId(req['userId'])
        return services
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    @Roles(Role.User)
    async getService(@Req() req: Request, @Param("id") id: number): Promise<ServiceModel> {
        const service = (await this.serviceRepo.getServiceByUserIdAndId(req['userId'], id))[0]
        return service
    }

    @Post()
    @UseGuards(AuthGuard)
    @Roles(Role.User)
    async addService(@Req() req: Request, @Body() service:Omit<ServiceModel, "userId">): Promise<void> {
        await this.serviceRepo.addService({...service, userId: req['userId']})
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    @Roles(Role.User)
    async deleteService(@Req() req: Request, @Param("id") id: number): Promise<void> {
        return await this.serviceRepo.deleteService(id)
    }
}
