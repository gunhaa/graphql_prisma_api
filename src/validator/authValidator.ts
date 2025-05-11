import { GraphQLError } from "graphql";

class AuthValidator {
  validateAuthorized(object: Record<string, any>): void {
    const nullAndFalseCount = Object.values(object).filter(value => value === null || value === false).length;

    if (nullAndFalseCount === 2) {
      throw new GraphQLError('JWT 인증에 실패하였습니다.', {
        extensions: { code: 'JWT_AUTHORIZE_ERROR' },
      });
    }
  }
}

export default new AuthValidator();
