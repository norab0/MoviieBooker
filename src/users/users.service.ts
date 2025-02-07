import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
    }

    async findOneById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if(!user) {
            throw new UnauthorizedException("L'utilisateur n'existe pas");
        }
        return user;
    }

    findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email })
    }

    create(registerDto: RegisterDto): Promise<User> {
        return this.userRepository.save(registerDto);
    }
}
