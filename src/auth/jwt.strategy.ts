import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import {ConfigService} from "@nestjs/config";
import {UsersService} from "../users/users.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private usersService: UsersService,
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey : configService.get('JWT_SECRET'),
        });
    }

    async validate(payload){
        return await this.usersService.findOneById(payload.sub);
    }
}