import { AuthenticationInput, Session } from "../../domain/entities/Session";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { validateAuth } from "../../domain/policies/validation";
export class AuthUseCases {
  constructor(private readonly repository: AuthRepository) {}
  validate(input: AuthenticationInput) {
    return validateAuth(input, input.register, input.role);
  }
  restore() {
    return this.repository.restore();
  }
  authenticate(input: AuthenticationInput) {
    if (Object.keys(this.validate(input)).length)
      throw new Error("Invalid authentication input");
    return this.repository.authenticate(input);
  }
  save(session: Session) {
    return this.repository.save(session);
  }
  clear() {
    return this.repository.clear();
  }
}
