

export class JoinMemberDto {

    email!: string;

    name: string | null;

    password!: string;

    address!: string;

    constructor(email: string, name: string | null, password: string, address: string){
        this.email = email;
        this.name = name;
        this.password = password;
        this.address = address;
    }
}
