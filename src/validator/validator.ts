import { GraphQLError } from "graphql";

class Validator {
  private emailRegex;
  private passwordRegex;

  constructor(emailRegex: RegExp, passwordRegex: RegExp) {
    this.emailRegex = emailRegex;
    this.passwordRegex = passwordRegex;
  }

  validateEmail(email: string): void {
    if (!this.emailRegex.test(email)) {
      throw new GraphQLError(
        "이메일 형식이 올바르지 않습니다. '@'를 포함한 유효한 이메일을 입력해주세요.",
        {
          extensions: {
            code: "INVALID_EMAIL_FORMAT",
          },
        }
      );
    }
  }

  validatePassword(password: string): void {
    if (!this.passwordRegex.test(password)) {
      throw new GraphQLError(
        "비밀번호 형식이 올바르지 않습니다. 8~20자의 영문자와 숫자를 포함해야 합니다.",
        {
          extensions: {
            code: "INVALID_PASSWORD_FORMAT",
          },
        }
      );
    }
  }

  validateMaxLength(
    value: string | null,
    max: number,
    engField: string,
    korField: string
  ): void {
    if (value === null) {
      return;
    }
    if (value.length > max) {
      throw new GraphQLError(
        `${korField}의 길이가 올바르지 않습니다. ${max}자 이하의 ${korField}을(를) 입력해주세요.`,
        {
          extensions: {
            code: `INVALID_${engField.toUpperCase()}_LENGTH`,
          },
        }
      );
    }
  }

  validateSqlInjection(value: string) {}
}

const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex: RegExp = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
const sqlInjectionRegex: RegExp = /asd/;

export default new Validator(emailRegex, passwordRegex);
