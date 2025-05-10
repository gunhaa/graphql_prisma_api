import { MemberLoginDto } from "../member/memberLogin.dto";
import memberService from "../member/service";
import { JwtCookie } from "./jwtCookie.type";


export const jwtResolver = {
    Query: {
        login: (_: void, args: { input: MemberLoginDto }, context: any): Promise<JwtCookie> => {
            return memberService.login(args.input, context.jwtContext);
        },
    }
};
