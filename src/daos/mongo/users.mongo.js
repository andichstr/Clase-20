import { UserModel } from '../../models/users.model.js';
import { logger } from '../../utils/logger.js';

export default class User {
    constructor(){}

    async get() {
        try {
            return await UserModel.find({}); 
        } catch(error){
            logger.error(error);
            return null;
        }
    }

    async getByEmail(email) {
        try {
            return await UserModel.find({email: email})
        } catch (error) {
            logger.error(error);
            return null;
        }
    }

    async create(user) {
        try {
            return await UserModel.create(user);
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async getById(id) {
        try {
            return await UserModel.find({_id: id});   
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async update(id, user) {
        try {
            return await UserModel.updateOne({_id: id}, user);
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async delete(id) {
        try {
            UserModel.delete({_id: id});
        } catch(error) {
            logger.error(error);
        }
    }
}
