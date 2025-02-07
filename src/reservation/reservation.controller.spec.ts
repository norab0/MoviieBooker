import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ReservationDto } from './dto/reservation.dto';
import { User } from '../users/entities/user.entity';

describe('ReservationController', () => {
    let controller: ReservationController;
    let reservationService: ReservationService;
    let userService: UsersService;

    const mockUser: User = { id: 1, email: "test@test.com", password: "hashed_password", reservations: [] };

    beforeEach(async () => {
        const mockReservationService = {
            createReservation: jest.fn(),
            getReservationsByUser: jest.fn(),
            deleteReservation: jest.fn(),
        };

        const mockUsersService = {
            findOneById: jest.fn().mockResolvedValue(mockUser),
        };

        const mockJwtAuthGuard = {
            canActivate: jest.fn(() => true), // Mock JwtAuthGuard to always pass
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReservationController],
            providers: [
                { provide: ReservationService, useValue: mockReservationService },
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtAuthGuard, useValue: mockJwtAuthGuard },
            ],
        }).compile();

        controller = module.get<ReservationController>(ReservationController);
        reservationService = module.get<ReservationService>(ReservationService);
        userService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createReservation', () => {
        it('should create a reservation successfully', async () => {
            const reservationDto: ReservationDto = {
                movieId: 1,
                timeStart: new Date('2025-02-05T20:00:00.000Z'),
            };

            const mockReservation = {
                id: 1,
                movieId: 1,
                timeStart: new Date('2025-02-05T20:00:00.000Z'),
                timeEnd: new Date('2025-02-05T22:00:00.000Z'),
                user: mockUser,
            };

            jest.spyOn(reservationService, 'createReservation').mockResolvedValue(mockReservation);

            const result = await controller.createReservation({ user: { id: 1 } }, reservationDto);
            expect(result).toEqual(mockReservation);
            expect(reservationService.createReservation).toHaveBeenCalledWith(mockUser, reservationDto);
        });

        it('should throw ConflictException if reservation already exists', async () => {
            const reservationDto: ReservationDto = {
                movieId: 1,
                timeStart: new Date('2025-02-05T20:00:00.000Z'),
            };

            jest.spyOn(reservationService, 'createReservation').mockRejectedValue(new ConflictException('Conflit de réservation'));

            try {
                await controller.createReservation({ user: { id: 1 } }, reservationDto);
            } catch (e) {
                expect(e).toBeInstanceOf(ConflictException);
                expect(e.message).toBe('Conflit de réservation');
            }
        });
    });

    describe('getReservations', () => {
        it('should get all reservations for the logged-in user', async () => {
            const mockReservations = [
                {
                    id: 1,
                    movieId: 1,
                    timeStart: new Date('2025-02-05T20:00:00.000Z'),
                    timeEnd: new Date('2025-02-05T22:00:00.000Z'),
                    user: mockUser,
                },
            ];

            jest.spyOn(reservationService, 'getReservationsByUser').mockResolvedValue(mockReservations);

            const result = await controller.getReservations({ user: { id: 1 } });
            expect(result).toEqual(mockReservations);
            expect(reservationService.getReservationsByUser).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('cancelReservation', () => {
        it('should cancel a reservation successfully', async () => {
            const reservationId = 1;
            const mockResponse = { message: 'Réservation annulée avec succès' };

            jest.spyOn(reservationService, 'deleteReservation').mockResolvedValue(mockResponse);

            const result = await controller.cancelReservation({ user: { id: 1 } }, String(reservationId));
            expect(result).toEqual(mockResponse);
            expect(reservationService.deleteReservation).toHaveBeenCalledWith(mockUser, reservationId);
        });

        it('should throw NotFoundException if reservation does not exist for the user', async () => {
            const reservationId = 1;

            jest.spyOn(reservationService, 'deleteReservation').mockRejectedValue(new NotFoundException('Réservation non trouvée'));

            try {
                await controller.cancelReservation({ user: { id: 1 } }, String(reservationId));
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundException);
                expect(e.message).toBe('Réservation non trouvée');
            }
        });
    });
});
