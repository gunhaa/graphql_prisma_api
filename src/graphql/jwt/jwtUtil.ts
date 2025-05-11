import jwt, {
  JwtPayload,
} from "jsonwebtoken";
import { jwtContext } from "./jwtContext.type";
import { JwtCookie } from "./jwtCookie.type";
import { memberStatus } from "./memberStatus.type";

export class JwtUtil {
  static generateToken(email: string, jwtContext: jwtContext): JwtCookie {
    const accessToken = jwt.sign({ email: email }, jwtContext.JWT_SECRET, {
      expiresIn: jwtContext.JWT_EXPIRATION,
    });
    return { accessToken: accessToken };
  }

  static verifyHeader(authorization: string | undefined, JWT_SECRET: string): memberStatus {
    const parseAuthorization = authorization || "";
    const token = parseAuthorization.replace("Bearer ", "");

    let memberStatus: memberStatus = {
      email: null,
      isAuthenticated: false,
    };

    let decodedJwt: JwtPayload
    if (token) {

      try {
         decodedJwt = jwt.verify(
          token,
          JWT_SECRET
        ) as JwtPayload;
      } catch (e) {
        // null, false를 리턴해 authValidator에서 처리
        return memberStatus;
      }

      if (decodedJwt && decodedJwt.email) {
        memberStatus = {
          email: decodedJwt.email,
          isAuthenticated: true,
        };
      }
    }

    return memberStatus;
  }
}
