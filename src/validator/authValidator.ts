import { GraphQLError } from "graphql";

class AuthValidator {
  validateAuthorized(object: Record<string, any>): void {
    for (const key in object) {
      if (object[key] === null) {
        throw new GraphQLError("인증에 실패 하였습니다.", {
          extensions: { code: "JWT_AUTHORIZE_ERROR" },
        });
      }
    }
  }
}

export default new AuthValidator();
