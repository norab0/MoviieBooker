import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Reservation} from "./entities/reservation.entity";
import {LessThan, MoreThan, Between, Repository} from "typeorm";
import {User} from "../users/entities/user.entity";
import {ReservationDto} from "./dto/reservation.dto";

@Injectable()
export class ReservationService {

    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
    ){}

    async createReservation(user: User, reservationDto: ReservationDto) {
        const { movieId, timeStart } = reservationDto;
        const start = new Date(timeStart)
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

        const conflict = await this.reservationRepository.findOne({
            where:[
                {
                    user: {id: user.id},
                    timeStart: Between(start, end),
                },
                {
                    user: {id: user.id},
                    timeStart: LessThan(start),
                    timeEnd: MoreThan(start),
                }
            ]
        });

        if(conflict){
            throw new ConflictException('Il y a déjà une réservation pour ce créneau horaire');
        }

        try {
            const reservation = this.reservationRepository.create({
                movieId: movieId,
                timeStart: start,
                timeEnd: end,
                user: user,
            });

            if(!user.reservations){
                user.reservations = [];
            }
            user.reservations.push(reservation);

            await this.reservationRepository.save(reservation);
            await this.reservationRepository.manager.save(reservation);

            return reservation;
        } catch (error) {
            throw new ConflictException(error);
        }
    }

    async getReservationsByUser(user: User): Promise<Reservation[]> {
        return await this.reservationRepository.find({
            where: {
                user: {id: user.id},
            },
            order: {
                timeStart: 'ASC',
            }
        })
    }

    async deleteReservation(user: User, reservationId: number): Promise<{ message: string }> {
        const toDeleteReservation = await this.reservationRepository.findOne({
            where: {
                id: reservationId,
                user: {id: user.id}
            },
        });

        if(!toDeleteReservation){
            throw new NotFoundException("Cette réservation n'existe pas pour cet utilisateur");
        }

        try{
            await this.reservationRepository.remove(toDeleteReservation);
            return { message : "Réservation supprimée avec succès"};
        } catch (error) {
            console.error('Erreur lors de la suppression de la réservation', error);
            throw error;
        }
    }
}
