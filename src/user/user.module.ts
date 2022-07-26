import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ServiceEntity, UserEntity} from "./user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ServiceEntity])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
