import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {User} from "./users/entities/user.entity";
import {ConfigModule} from "@nestjs/config";
import { MoviesModule } from './movies/movies.module';
import { ReservationModule } from './reservation/reservation.module';
import {Reservation} from "./reservation/entities/reservation.entity";

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.HOST,
          port: 27028,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [User, Reservation],
          synchronize: true,
          ssl: {
            rejectUnauthorized: false,
          }
      }),
      AuthModule,
      UsersModule,
      MoviesModule,
      ReservationModule,
      
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
