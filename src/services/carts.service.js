//@ts-check
import { CartsRepository } from '../daos/factory.js';
import { CustomException } from '../exceptions/custom.exception.js';
import CustomResponse from '../exceptions/custom.response.js';
import { ErrorTypes } from '../exceptions/enum.exception.js';
import { ProductService } from './products.service.js'

const CARTS_SERVICE_NAME = "CartsService"

export class CartService {
    constructor() {
        this.productService = new ProductService();
        this.cartsRepository = new CartsRepository();
    }

    async getCarts() {
        const carts = await this.cartsRepository.get({}); 
        return carts;
    }

    async addCart() {
        const cart = await this.cartsRepository.create()
        if (!!cart) return cart;
        else throw new CustomException(`Something went wrong, cart not created. Please try again.`, 500, "CartsException", ErrorTypes.CARTS_ERROR);
    }

    /**
     * @param {String} id
     */
    async getCartById(id) {
        const foundCart = await this.cartsRepository.getById(id);
        if (!!foundCart) return foundCart;
        else throw new CustomException(`Cart with id: ${id} not found.`, 404, "CartsException", ErrorTypes.CARTS_ERROR);
    }

    /**
     * @param {String} cartId
     * @param {String} productId
     */
    async addProductToCart(cartId, productId) {
        const hasStock = await this.productService.checkStock(productId)
        if (hasStock) {
            const cart = await this.cartsRepository.getById(cartId);
            if (!cart) throw new CustomException("Cart not found", 404, "CartsException", ErrorTypes.CARTS_ERROR);
            const productIndex = this.productInCart(cart, productId);
            if (productIndex>=0) cart.products[productIndex].quantity++;
            else cart.products.push({product: productId, quantity: 1});
            await this.productService.reduceProductStock(productId);
            await this.cartsRepository.update(cartId, cart);
            return await this.productService.getProductById(productId);
        } else {
            throw new CustomException(`Product with id ${productId} doesn't have stock`, 400, "CartsException", ErrorTypes.CARTS_ERROR);
        }
    }
    /**
     * @param {Object} cart
     * @param {String} pid
     */
    productInCart(cart, pid) {
        let productInCart = false;
        let i = 0;
        while (!productInCart && i<cart.products.length) {
            if (pid == cart.products[i].product.toString()) productInCart = true;
            i++;
        }
        i -= 1
        return productInCart ? i : -1;
    }

    /**
     * @param {string} cartId
     * @param {string} productId
     */
    async deleteProduct(cartId, productId) {
        const cart = await this.getCartById(cartId);
        if (!cart) throw new CustomException(
            `The cart with id ${cartId} was not found`,
            404,
            CARTS_SERVICE_NAME,
            ErrorTypes.CARTS_ERROR
        );
        const index = this.productInCart(cart, productId);
        if (!!index) {
            cart.products.splice(index, 1);
        }
        await this.updateCartById(cartId, cart)
        return new CustomResponse("The product was deleted succesfully", 200);
    }

    /**
     * @param {string} cartId
     * @param {Object} cart
     */
    async updateCartById(cartId, cart) {
        //missing cart validation here
        await this.cartsRepository.update({_id: cartId}, cart);
    }

    /**
     * @param {string} cartId
     * @param {string} productId
     * @param {Object} cartUpdate
     */
    async updateProductQuantity(cartId, productId, cartUpdate) {
        const cart = await this.cartsRepository.findById(cartId);
        if(!cart) return;
        const quantity = cartUpdate.quantity;
        const index = this.productInCart(cart, productId);
        if (!!index && quantity > 0) {
            cart.products[index].quantity = quantity;
        }
        await this.updateCartById(cartId, cart);
    }

    /**
     * @param {string} cartId
     */
    async deleteAllProducts(cartId) {
        const cart = await this.getCartById(cartId);
        if(!!cart) cart.products = [];
    }
}