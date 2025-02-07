import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import {ConfigModule} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      HttpModule,
      MoviesModule,
  ],
  providers: [MoviesService],
  controllers: [MoviesController]
})
export class MoviesModule {}
