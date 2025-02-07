import { Body, Request, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Param } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { RegisterDto } from "../users/dto/register.dto";
import { LoginDto } from "../users/dto/login.dto";
import { Public } from './public.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('inscription')
    @Public()
    @ApiOperation({ summary: 'Inscrire un nouvel utilisateur' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'test@test.com' },
                password: { type: 'string', example: 'Test1234' },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Utilisateur inscrit avec succès',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'L\'email existe déjà',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Erreur interne du serveur',
    })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('connexion')
    @Public()
    @ApiOperation({ summary: 'Connecter un utilisateur existant et générer un jeton JWT' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'test@test.com' },
                password: { type: 'string', example: 'Test1234' },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Utilisateur connecté avec succès, jeton JWT généré',
        schema: {
            example: {
                access_token: 'jwt-token-here',
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Email ou mot de passe invalide',
    })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @Get('utilisateur/:id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Obtenir les détails de l\'utilisateur par ID' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Détails de l\'utilisateur récupérés avec succès',
        schema: {
            example: {
                id: 1,
                email: 'test@test.com',
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Accès non autorisé, jeton invalide ou expiré',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Utilisateur non trouvé',
    })
    getUser(@Param('id') id: string) {
        return this.usersService.findOneById(Number(id));
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Obtenir les détails de l\'utilisateur connecté' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Détails de l\'utilisateur connecté récupérés avec succès',
        schema: {
            example: {
                id: 1,
                email: 'test@test.com',
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Accès non autorisé, jeton invalide ou expiré',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Utilisateur non trouvé',
    })
    async getConnectedUser(@Request() req) {
        return await this.usersService.findOneById(req.user.id);
    }
}
