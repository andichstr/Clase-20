import { MessagesRepository } from '../daos/factory.js';
import { CustomException } from '../exceptions/custom.exception.js';
import { ErrorTypes } from '../exceptions/enum.exception.js';

export class MessageService {
  constructor() {
    this.messagesRepository = new MessagesRepository();
  }
  validatePostMsg(email, msg) {
    if (!email || !msg) {
      throw new CustomException("Please, complete email and message", 400, "MessagesException", ErrorTypes.MESSAGES_ERROR);
    }
  }

  async getAllMessages() {
    const messages = await this.messagesRepository.get();
    if (!!messages) return messages;
    else throw new CustomException("No messages found", 404, "MessagesException", ErrorTypes.MESSAGES_ERROR);
  }

  async addMessage(message) {
    const email = message.user;
    const msg = message.message;
    this.validatePostMsg(email, msg);
    const msgCreated = await this.messagesRepository.create(message);
    return msgCreated;
  }
}
