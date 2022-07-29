import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ServiceEntity, UserEntity} from "./user.entity";
import {ServiceController} from "./service.controller";
import {ServicesService} from "./services.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ServiceEntity])],
  providers: [UsersService, ServicesService],
  exports: [UsersService],
  controllers: [ServiceController]
})
export class UserModule {}
