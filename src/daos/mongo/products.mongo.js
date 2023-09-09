import { ProductModel } from '../../models/products.model.js';
import { logger } from '../../utils/logger.js';

export default class Product {
    constructor(){}

    async get(query, options) {
        try {
            return await ProductModel.paginate(JSON.parse(query), options); 
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async create(product) {
        try {
            return await ProductModel.create(product)
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async getById(id) {
        try {
            return await ProductModel.findById(id);
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async update(id, product) {
        try {
            return await ProductModel.updateOne({_id: id}, product)
        } catch(error) {
            logger.error(error);
            return null;
        }
    }

    async delete(id) {
        try {
            ProductModel.delete({_id: id});
        } catch(error) {
            logger.error(error);
        }
    }

    async getByCode(code) {
        try {
            return await ProductModel.find({code: code});
        } catch(error) {
            logger.error(error);
            return null;
        }
    }
}
