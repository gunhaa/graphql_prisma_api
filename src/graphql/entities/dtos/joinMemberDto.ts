import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from "class-validator";

export class JoinMemberDto {

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    name: string | null;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password!: string;

    @IsString()
    @IsNotEmpty()
    address!: string;

    constructor(email: string, name: string | null, password: string, address: string){
        this.email = email;
        this.name = name;
        this.password = password;
        this.address = address;
    }
}
