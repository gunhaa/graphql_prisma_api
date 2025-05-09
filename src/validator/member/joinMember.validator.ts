import { GraphQLError } from "graphql";
import Validator from "../validator";

export const validateJoinMember = (email: string, name: string | null, password: string, address: string) => {
  if (!Validator.validateEmail(email)) {
    throw new GraphQLError(
      '이메일 형식이 올바르지 않습니다. \'@\'를 포함한 유효한 이메일을 입력해주세요.',
      {
        extensions: {
          code: 'INVALID_EMAIL_FORMAT',
        },
      }
    );
  }

  if(!Validator.validateMaxLength(name, 20)){
    throw new GraphQLError(
      '이름의 길이가 올바르지 않습니다. 20자 이하의 이름으로 입력해주세요.',
      {
        extensions: {
          code: 'INVALID_NAME_LENGTH',
        },
      }
    );
  }

  if (!Validator.validatePassword(password)) {
    throw new GraphQLError(
      '비밀번호 형식이 올바르지 않습니다. 8~20자의 영문자와 숫자를 포함해야 합니다.',
      {
        extensions: {
          code: 'INVALID_PASSWORD_FORMAT',
        },
      }
    );
  }

  if(!Validator.validateMaxLength(address, 100)){
    throw new GraphQLError(
      '주소의 길이가 올바르지 않습니다. 100자 이하의 주소를 입력해주세요.',
      {
        extensions: {
          code: 'INVALID_ADDRESS_LENGTH',
        },
      }
    );
  }
}
