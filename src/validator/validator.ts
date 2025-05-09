class Validator {
  private emailRegex;
  private passwordRegex;

  constructor(emailRegex: RegExp, passwordRegex: RegExp) {
    this.emailRegex = emailRegex;
    this.passwordRegex = passwordRegex;
  }

  validateEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    return this.passwordRegex.test(password);
  }

  validateMaxLength(value: string | null, length: number):boolean {
    if(value === null) {
      return true;
    }
    return value.length <= length;
  }
}

const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex: RegExp = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;

export default new Validator(emailRegex, passwordRegex);
