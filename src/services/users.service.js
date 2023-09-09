import UserDTO from '../DTOs/user.dto.js';
import { UsersRepository } from '../daos/factory.js';
import { logger } from '../utils/logger.js';

export class UsersService {
  constructor() {
    this.usersRepository = new UsersRepository();
  }
  
  async getUserById(id) {
    return this.usersRepository.getById(id);
  }

  async makePremium(id) {
    const user = this.usersRepository.getById(id);
    if (!!user && user.role=="user") {
      user.role = "premium";
      this.usersRepository.update(id, user);
      return new UserDTO(user);
    } else {
      logger.warning(`This user doesn't have user role, cannot make it premium. The current user role is: ${user.role}.`)
      return null;
    }
  }
}
