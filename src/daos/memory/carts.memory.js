export default class Cart {
    constructor(){
        this.carts = [];
    }

    async get() {
        return this.carts; 
    }

    async createCart() {
        this.carts.push([]);
        return [];
    }

    async getCartById(id) {
        return this.carts[id];
    }

    async updateCart(id, cart) {
        this.carts[id] = cart;
    }

    async deleteCart(id) {
        this.carts.slice(id,1);
    }
}
