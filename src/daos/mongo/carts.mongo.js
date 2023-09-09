import { CartModel } from "../../models/carts.model.js";
import { logger } from "../../utils/logger.js";

export default class Cart {
    constructor(){}

    async get() {
        try {
            return await CartModel.find({}); 
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async create() {
        try {
            return await CartModel.create({"products": []})            
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async getById(id) {
        try {
            return await CartModel.findById(id).populate({
                path: "products",
                populate: {
                    path: "product"
                }
            });
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async update(id, cart) {
        try {
            return await CartModel.updateOne({_id: id}, cart)
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async delete(id) {
        try {
            CartModel.delete({_id: id});
        } catch(error) {
            logger.error(error);
            return null;
        }
    }
}
