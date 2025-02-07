import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";
import { RegisterDto } from "../users/dto/register.dto";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "../users/dto/login.dto";
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
        const { email, password } = loginDto;

        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('L\'utilisateur n\'existe pas');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Mot de passe invalide');
        }

        const payload = {
            sub: user.id,
            email: user.email,
        }

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }

    async register(registerDto: RegisterDto): Promise<User> {
        const { email, password } = registerDto;

        const existingUser = await this.usersService.findOneByEmail(email);
        if (existingUser) {
            throw new UnauthorizedException('L\'email existe déjà');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            return this.usersService.create({ email, password: hashedPassword });
        } catch (error) {
            throw new UnauthorizedException('Erreur interne');
        }
    }
}
