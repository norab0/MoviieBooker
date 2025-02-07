import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Reservation} from "./entities/reservation.entity";
import {User} from "../users/entities/user.entity";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, User]), UsersModule],
  controllers: [ReservationController],
  providers: [ReservationService]
})
export class ReservationModule {}
