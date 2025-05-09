import { GraphQLError } from "graphql";
import { JoinMemberDto } from "src/graphql/member/joinMember.dto";
import Validator from "../validator";

export const validateJoinMemberDto = (joinMemberDto: JoinMemberDto) => {
  if (!Validator.validateEmail(joinMemberDto.email)) {
    throw new GraphQLError(
      '이메일 형식이 올바르지 않습니다. \'@\'를 포함한 유효한 이메일을 입력해주세요.',
      {
        extensions: {
          code: 'INVALID_EMAIL_FORMAT',
        },
      }
    );
  }

  if (!Validator.validatePassword(joinMemberDto.password)) {
    throw new GraphQLError(
      '비밀번호 형식이 올바르지 않습니다. 8~20자의 영문자와 숫자를 포함해야 합니다.',
      {
        extensions: {
          code: 'INVALID_PASSWORD_FORMAT',
        },
      }
    );
  }
}
