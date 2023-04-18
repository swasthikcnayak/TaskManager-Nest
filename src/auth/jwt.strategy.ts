import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from "./dto/jwt-payload.interface";
import { User } from "./user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository){
        super({
            secretOrKey:'secret',
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload : JwtPayload) : Promise<User> {
        const {username} = payload;
        const user : User = await this.userRepository.findOne({where : {username}});

        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }
}