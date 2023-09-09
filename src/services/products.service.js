//@ts-check
import { ProductsRepository } from '../daos/factory.js';
import { CustomException } from '../exceptions/custom.exception.js';
import { ErrorTypes } from '../exceptions/enum.exception.js';
import { logger } from '../utils/logger.js';

export class ProductService {
    constructor () {
        this.productsRepository = new ProductsRepository();
    }

    /**
     * @param {{ 
     * title: string,
     * description: string,
     * code: string,
     * price: number,
     * stock: number,
     * category: string
     *  }} product
     */
    async addProduct(product) {
        try {
            //falta validar producto
            const codeRepeated = await this.isCodeRepeated(product.code);
            if (!codeRepeated){
                return await this.productsRepository.create(product);
            } else {
                throw new CustomException(
                    `Error al agregar producto ingresado con codigo ${product.code}: Codigo repetido.`,
                    400,
                    "ProductsException",
                    ErrorTypes.PRODUCTS_ERROR
                );
            }
        } catch (err) {
            logger.error(err);
            throw new CustomException("Error validando el producto",
            500,
            "ProductsException",
            ErrorTypes.PRODUCTS_ERROR);
        }
    }

    /**
     * @param {Object} options
     * @param {Object} query
     */
    async getProducts(query, options) {
        let sort;
        if (!!options.sort && options.sort == "asc") {
            sort = {
                price: 1
            }
        } else if (!!options.sort && options.sort == "desc") {
            sort = {
                price: -1
            }
        } else sort = undefined;
        options.sort = sort;
        // @ts-ignore
        const response = await this.productsRepository.get(query, options);
        const status = response.docs.length > 0 ? "Success" : "Error";
        const payload = response.docs;
        delete response.docs;
        const firstLink = "http://localhost:8080/products/?page=1";
        const lastLink = `http://localhost:8080/products/?page=${response.totalPages}`;
        const prevLink = response.hasPrevPage ? `http://localhost:8080/products/?page=${response.prevPage}` : null;
        const nextLink = response.hasNextPage ? `http://localhost:8080/products/?page=${response.nextPage}` : null;
        const res = {
            status: status,
            payload: payload,
            totalPages: response.totalPages,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
            page: response.page,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            firstLink: firstLink,
            lastLink: lastLink,
            prevLink: prevLink,
            nextLink: nextLink
        }
        return res;
}

    /**
     * @param {string} id
     */
    async getProductById(id) {
        const foundProduct = await this.productsRepository.getById(id);
        if(!!foundProduct){
            return foundProduct
        } else throw new CustomException(`Product with id: ${id} not found.`,
        404,
        "ProductsException",
        ErrorTypes.PRODUCTS_ERROR);
    }

    /**
     * @param {string} id
     * @param {object} update
     */
    async updateProduct(id, update) {
        try {
            const isValid = validateUpdate(update);
            if(isValid) {
                const product = await this.getProductById(id);
                const updatedProduct = prepareProduct(product, update);
                await this.productsRepository.update(id, updatedProduct);
            } else {
                logger.debug(update);
            }
        } catch (err) {
            logger.error(err);
            throw new CustomException("Error validando el update",
            500,
            "ProductsException",
            ErrorTypes.PRODUCTS_ERROR);
        }
    }

    /**
     * @param {string} id
     */
    async deleteProduct(id) {
        return await this.productsRepository.delete(id);
    }

    /**
     * @param {string} id
     */
    async checkStock(id) {
        const product = await this.productsRepository.getById(id);
        return (!!product && product.stock>0);
    }
    /**
     * @param {string | any[]} products
     */
    async reduceStock(products){
        let i = 0;
        let hasStock = true;
        let product;
        while(hasStock && i < products.length) {
            product = await this.productsRepository.getById(products[i].id);
            if (!!product && product.stock < products[i].quantity) hasStock = false;
            i++;
        }
        if (hasStock){
            for (let n = 0; n < products.length; n++){
                product = await this.productsRepository.getById(products[n].id);
                if (!!product) { 
                    product.stock -= products[n].quantity
                    await this.updateProduct(products[n].id, product);
                }
            }
            return true;
        }
        return false;
    }
    /**
     * @param {string} id
     */
    async reduceProductStock(id, quantity){
        const product = await this.productsRepository.getById(id);
        if (!product) return;
        product.stock-= quantity;
        await this.updateProduct(id, product);
    }
    /**
     * @param {string} code
     */
    async isCodeRepeated(code) {
        const product = await this.productsRepository.getByCode(code);
        return product.length > 0;
    }

    /**
     * @param {{ title: string; description: string; code: string; price: number; stock: number; category: string; }} product
     */
    errorForProps(product) {
        if (!!product.title && typeof(product.title)!="string") return "Title is required and must be a string";
        if (!!product.description && typeof(product.description)!="string") return "Description is required and must be a string";
        if (!!product.code && typeof(product.code)!="string") return "Code is required and must be a string";
        if (!!product.price && typeof(product.price)!="number") return "Price is required and must be a number";
        if (!!product.stock && typeof(product.stock)!="number") return "Stock is required and must be a number";
        if (!!product.category && typeof(product.category)!="string") return "Category is required and must be a string";
    }
}

/**
 * @param {object} update
 */
function validateUpdate(update) {
    let isValid = true;
    for (const [key, value] of Object.entries(update)) {
        switch(key) {
            case "title":
                logger.debug(`${key}: ${value}`);
                break;
            case "description":
                logger.debug(`${key}: ${value}`);
                break;
            case "code":
                logger.debug(`${key}: ${value}`);
                break;
            case "price":
                logger.debug(`${key}: ${value}`);
                break;
            case "stock":
                logger.debug(`${key}: ${value}`);
                break;
            case "category":
                logger.debug(`${key}: ${value}`);
                break;
            case "thumbnails":
                logger.debug(`${key}: ${value}`);
                break;
            default:
                logger.debug(`${key}: ${value}`);
                isValid = false;
                break;
        }
    }
    return isValid;
}

/**
 * @param {object} product
 * @param {object} update
 */
function prepareProduct(product, update) {
    for (const [key, value] of Object.entries(update)) {
        switch(key) {
            case "title":
                product.title = value;
                break
            case "description":
                product.description = value;
                break
            case "code":
                product.code = value;
                break
            case "price":
                product.price = value;
                break
            case "stock":
                product.stock = value;
                break
            case "category":
                product.category = value;
                break
            case "thumbnails":
                product.thumbnails = value;
                break
        }
    }
    return product;
}