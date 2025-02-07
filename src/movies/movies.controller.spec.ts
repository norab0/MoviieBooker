import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('MoviesController', () => {
    let controller: MoviesController;
    let moviesService: MoviesService;

    beforeEach(async () => {
        const mockMoviesService = {
            getPopularMovies: jest.fn(),
        };

        const mockJwtAuthGuard = {
            canActivate: jest.fn(() => true), // Mock JwtAuthGuard pour toujours passer
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoviesController],
            providers: [
                { provide: MoviesService, useValue: mockMoviesService },
                { provide: JwtAuthGuard, useValue: mockJwtAuthGuard },
            ],
        }).compile();

        controller = module.get<MoviesController>(MoviesController);
        moviesService = module.get<MoviesService>(MoviesService);
    });

    it('doit être défini', () => {
        expect(controller).toBeDefined();
    });

    
});
