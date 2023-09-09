import { MessagesModel } from "../../models/messages.model.js";
import { logger } from "../../utils/logger.js";

export default class Message {
    constructor(){}

    async get() {
        try {
            return await MessagesModel.find({}).sort({date: 1}).lean();
        } catch(error) {
            logger.error(error);
            return null
        }
    }

    async create(message) {
        try {
            return await MessagesModel.create(message);
        } catch(error) {
            logger.error(error);
            return null;
        }
    }
}
