import jwt from "jsonwebtoken";
import { jwtContext } from "./jwtContext.type";
import { JwtCookie } from "./jwtCookie.type";

export class JwtUtil {
  static generateToken(email: string, jwtContext: jwtContext): JwtCookie {
    const accessToken = jwt.sign({ email: email }, jwtContext.JWT_SECRET, {
      expiresIn: jwtContext.JWT_EXPIRATION,
    });
    return { accessToken: accessToken };
  }

}
