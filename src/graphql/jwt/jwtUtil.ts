import jwt, {
  JsonWebTokenError,
  JwtPayload,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { jwtContext } from "./jwtContext.type";
import { JwtCookie } from "./jwtCookie.type";
import { GraphQLError } from "graphql";
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

    let member: memberStatus = {
      email: null,
      isAuthenticated: false,
    };

    try {
      if (token) {
        const decodedJwt: JwtPayload = jwt.verify(
          token,
          JWT_SECRET
        ) as JwtPayload;

        if (decodedJwt && decodedJwt.email) {
          member = {
            email: decodedJwt.email,
            isAuthenticated: true,
          };
        }
      }
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        throw new GraphQLError("JWT 관련 오류", {
          extensions: { code: "JSON_WEB_TOKEN_ERROR" },
        });
      } else if (e instanceof TokenExpiredError) {
        throw new GraphQLError("토큰 만료 오류", {
          extensions: { code: "TOKEN_EXPIRED_ERROR" },
        });
      } else if (e instanceof NotBeforeError) {
        throw new GraphQLError("발급 시간 오류", {
          extensions: { code: "NOT_BEFORE_ERROR" },
        });
      } else {
        throw new GraphQLError("기타 JWT 오류", {
          extensions: { code: "JWT_ERROR" },
        });
      }
    }

    return member;
  }
}
