import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
    private readonly apiUrl: string | undefined;
    private readonly bearerToken: string | undefined;

    constructor(
        private httpService: HttpService,
        private configService: ConfigService,
    ) {
        this.apiUrl = this.configService.get<string>('TMDB_API_URL');
        this.bearerToken = this.configService.get<string>('TMDB_API_TOKEN');
    }

    async getMovies(page: number = 1, search?: string, sort?: string) {
        try {
            let url = '';
      
            if (search) {
                url = `https://api.themoviedb.org/3/search/movie?api_key=${this.bearerToken}&query=${encodeURIComponent(search)}&page=${page}&language=fr-FR`;
            } else {
                url = `${this.apiUrl}/popular?api_key=${this.bearerToken}&page=${page}&language=fr-FR`;
            }
      
            const response = await firstValueFrom(this.httpService.get(url));
      
            let movies = response.data.results;
      
            // Tri (si demandé)
            if (sort) {
                movies = this.sortMovies(movies, sort);
            }
      
            return {
                page: response.data.page,
                total_pages: response.data.total_pages,
                total_results: response.data.total_results,
                results: movies,
            };
        } catch (error) {
            throw new HttpException('Erreur lors de la récupération des films', HttpStatus.BAD_REQUEST);
        }
    }

    async searchMovie(query: string) {
        try {
            const url = `https://api.themoviedb.org/3/search/movie?api_key=${this.bearerToken}&query=${encodeURIComponent(query)}&language=fr-FR`;
            const response = await firstValueFrom(this.httpService.get(url));
            return response.data;
        } catch (error) {
            throw new HttpException('Erreur lors de la recherche du film', HttpStatus.BAD_REQUEST);
        }
    }

    private sortMovies(movies: any[], sort: string) {
        switch (sort) {
            case 'title_asc':
                return movies.sort((a, b) => a.title.localeCompare(b.title));
            case 'title_desc':
                return movies.sort((a, b) => b.title.localeCompare(a.title));
            case 'date_asc':
                return movies.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
            case 'date_desc':
                return movies.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
            default:
                return movies; // Aucun tri appliqué
        }
    }
}
