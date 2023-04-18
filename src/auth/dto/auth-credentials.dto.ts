import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto{
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    username : string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
     { message : "Weak Password"})
    password : string;

}