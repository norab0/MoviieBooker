import {IsDateString, IsNotEmpty} from "class-validator";

export class ReservationDto {

    @IsNotEmpty()
    movieId: number;

    @IsNotEmpty()
    @IsDateString()
    timeStart: Date;
}