
export class JoinMemberDto {

    readonly email!: string;

    readonly name: string | null;

    readonly password!: string;

    readonly address!: string;
    
    constructor(email: string, name: string | null, password: string, address: string){
        this.email = email;
        this.name = name;
        this.password = password;
        this.address = address;
    }
}
