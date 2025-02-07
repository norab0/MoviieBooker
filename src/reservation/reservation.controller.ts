import {Body, Request, Controller, Param, Post, UseGuards, Get, Delete} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {ReservationDto} from "./dto/reservation.dto";
import {ReservationService} from "./reservation.service";
import {UsersService} from "../users/users.service";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse} from "@nestjs/swagger";


@Controller('reservation')
export class ReservationController {
    constructor(
        private readonly reservationService: ReservationService,
        private readonly userService: UsersService
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Créer une nouvelle réservation de film pour un utilisateur' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                movieId: { type: 'number', example: 1 },
                timeStart: { type: 'string', example: '2025-02-05T20:00:00.000Z' },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Réservation créée avec succès',
    })
    @ApiResponse({
        status: 400,
        description: 'Mauvaise requête, données invalides',
    })
    @ApiResponse({
        status: 409,
        description: 'Conflit, réservation déjà existante pour ce créneau horaire',
    })
    async createReservation(@Request() req, @Body() reservationDto: ReservationDto) {

        const user = await this.userService.findOneById(req.user.id);
        return await this.reservationService.createReservation(user, reservationDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Obtenir toutes les réservations pour l\'utilisateur connecté' })
    @ApiResponse({
        status: 200,
        description: 'Réservations récupérées avec succès',
        schema: {
            example: [
                {
                    id: 1,
                    movieId: 1,
                    timeStart: '2025-02-05T20:00:00.000Z',
                    timeEnd: '2025-02-05T22:00:00.000Z',
                },
            ],
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Non autorisé, jeton invalide ou expiré',
    })
    async getReservations(@Request() req) {
        const user = await this.userService.findOneById(req.user.id);
        return await this.reservationService.getReservationsByUser(user)
    }

    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Annuler une réservation pour un utilisateur par son ID' })
    @ApiResponse({
        status: 200,
        description: 'Réservation annulée avec succès',
    })
    @ApiResponse({
        status: 400,
        description: 'Mauvaise requête, ID de réservation invalide',
    })
    @ApiResponse({
        status: 404,
        description: 'Réservation non trouvée',
    })
    @ApiResponse({
        status: 401,
        description: 'Non autorisé, jeton invalide ou expiré',
    })
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async cancelReservation(@Request() req, @Param('id') reservationId: string) {
        const user = await this.userService.findOneById(req.user.id);
        return await this.reservationService.deleteReservation(user, Number(reservationId));
    }
}
