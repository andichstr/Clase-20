export default class Product {
    constructor() {
        this.products = [];
    }

    async get() {
        return this.products; 
    }

    async create(product) {
        id = this.products.length + 1;
        product.id = id;
        this.products.push(product);
        return product;
    }

    async getById(id) {
        const i = this.products.findIndex(product => product.id == id);
    }

    async update(id, product) {
        return await ProductModel.updateOne({_id: id}, product)
    }

    async delete(id) {
        ProductModel.delete({_id: id});
    }

    async getByCode(code) {
        return await ProductModel.find({code: code})
    }
}
