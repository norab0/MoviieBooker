import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from "./movies.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags('Movies')
@ApiBearerAuth('JWT-auth')
@Controller('movies')
export class MoviesController {

    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    @ApiOperation({ summary: 'Récupérer les films filtrés par page, titre ou différents critères de tri' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numéro de page pour la pagination (par défaut : 1)' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Chaîne de caractères pour filtrer les films' })
    @ApiQuery({ name: 'sort', required: false, type: String, description: "Critères de tri (ex : 'popularity.asc', 'release_date.desc')" })
    getPopularMovies(@Query('page') page: number = 1, @Query('search') search?: string, @Query('sort') sort?: string) {
        return this.moviesService.getMovies(page || 1, search, sort);
    }
}
