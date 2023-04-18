import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.reposity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserRepository) private userRepository:UserRepository){}
    
    async singUp(authCredentialsDto : AuthCredentialsDto): Promise<String>{
        return this.userRepository.createUser(authCredentialsDto);
    }

    async signIn(authCredentialsDto : AuthCredentialsDto) : Promise<String>{
        const {username,password} = authCredentialsDto;
        const user = await this.userRepository.findOne({ where : { username }});
    
        if(user && (await bcrypt.compare(password,user.password))){
            return "SUCCESS";
        }
        throw new UnauthorizedException("Please check the login credentials");
    }

}
