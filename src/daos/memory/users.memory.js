import { logger } from "../../utils/logger.js";

export default class User {
    constructor(){
        this.users = [];
    }

    async get() {
        return this.users;
    }

    async getByEmail(email) {
        try {
            const index = this.users.findIndex(user => user.email==email);
            const user = index != -1 ? this.users[index] : null;
            return user;
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async create(user) {
        try {
            const id = this.users.length>0 ? this.users[this.users.length-1].id + 1 : 0;
            user.id = id;
            this.users.push(user);
            return user;
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async getById(id) {
        try {
            const index = this.users.findIndex(user => user.id==id);
            const user = index != -1 ? this.users[index] : null;
            return user;
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async update(id, user) {
        try {
            const index = this.users.findIndex(user => user.id==id);
            if(index != -1) {
                this.users[index] = user;
                return user;
            } else {
                return null;
            }
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async delete(id) {
        try {
            const index = this.users.findIndex(user => user.id==id);
            if (index != -1) this.users.splice(index, 1);
        } catch(error) {
            logger.error(error);
        }
    }
}
