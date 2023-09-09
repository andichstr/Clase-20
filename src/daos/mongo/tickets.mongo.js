import { TicketModel } from '../../models/tickets.model.js';
import { logger } from '../../utils/logger.js';

export default class Ticket {
    constructor(){}

    async get() {
        try {
            return await TicketModel.find(); 
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async create(ticket) {
        try {
            return await TicketModel.create(ticket)
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async getById(id) {
        try {
            return await TicketModel.findById(id);
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async getByCode(code) {
        try {
            return await TicketModel.find({code: code});
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async getByPurchaser(email) {
        try {
            return await TicketModel.find({purchaser: email});
        } catch(error) {
            logger.error(error);
            return null;
        }
    }
}
