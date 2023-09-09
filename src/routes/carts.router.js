//@ts-check
import { Router } from "express";
import { CartService } from "../services/carts.service.js";
import { TicketService } from '../services/tickets.service.js';
import { ProductService } from "../services/products.service.js";
import { checkUser, getUserFromSession } from "../middlewares/auth.js";
import TicketDTO from "../DTOs/ticket.dto.js";
import { logger } from "../utils/logger.js";
import CustomResponse from "../exceptions/custom.response.js";

const router = Router();
const cartService = new CartService();
const ticketService = new TicketService();
const productService = new ProductService();

router.post("/", async (req, res) => {
    try {
        const addedCart = await cartService.addCart();
        return res.status(201).json({
            status: "Success",
            message: "Cart created successfully",
            data: addedCart
        });
    } catch (e) {
        return res.status(e.status).json({
            status: "Error",
            message: `${e.name}: ${e.message}`,
            data: null
        });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const id = req.params.cid;
        const cart = await cartService.getCartById(id);
        return res.status(200).json({
            status: "Success",
            message: "Cart found",
            data: !!cart ? cart.products : []
        })
    } catch (e) {
        return res.status(e.status||500).json({
            status: "Error",
            message: `${e.name}: ${e.message}`,
            data: null
        });
    }
});

router.post("/:cid/products/:pid", checkUser, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const addedProduct = await cartService.addProductToCart(cartId, productId);
        return res.status(201).json({
            status: "Success",
            message: "Product added successfully",
            data: addedProduct
        });
    } catch (e) {
        return res.status(e.status).json({
            status: "Error",
            message: `${e.name}: ${e.message}`,
            data: null
        });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try{
        const { cid, pid } = req.params;
        const response = await cartService.deleteProduct(cid, pid);
        return res.status(200).json(response);
    } catch (e) {

    }
    
});

router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { cart } = req.body;
        cartService.updateCartById(cid, cart);
        return new CustomResponse("The cart was updated succesfully", 200);
    } catch (e) {
        return new CustomResponse("Unhandled internal server error", 500);
    }
    
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { cart } = req.body;
        cartService.updateProductQuantity(cid, pid, cart);
        return new CustomResponse(`The product with id ${pid} was updated succesfully`, 200);
    } catch (e) {
        return new CustomResponse("Unhandled internal server error", 500);
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        await cartService.deleteAllProducts(cid);
        return new CustomResponse(`The products inside the cart with id ${cid} was deleted succesfully`, 200);
    } catch (e) {
        return new CustomResponse("Unhandled internal server error", 500);
    }
});

router.post("/:cid/purchase", checkUser, async(req, res) => {
    try {
        const user = getUserFromSession();
        const { cid } = req.params;
        const ticket = new TicketDTO({
            products: [],
            purchaser: user.email
        });
        const cart = await cartService.getCartById(cid);
        const addedProducts = [];
        cart.products.forEach(async (product) => {
            const actualProduct = await productService.getProductById(product.id);
            if (actualProduct.stock>=product.quantity) {
                await productService.reduceProductStock(product.id, product.quantity);
                ticket.products.push(product);
                ticket.ammount += product.price*product.quantity;
                addedProducts.push(product);
            }
        })
        addedProducts.forEach(async (product) => {
            let i=0;
            while(i<cart.products.length) {
                if (product.id == cart.products[i].id) {
                    cart.products.splice(i, 1);
                } else {
                    i++;
                }
            }
        })
        await cartService.updateCartById(cart.id, cart);
        await ticketService.addTicket(ticket);
        return new CustomResponse("The purchase was executed succesfully", 201, cart.products)
    } catch (e) {
        logger.error(e);
        return new CustomResponse("Unhandled internal server error", 500);
    }
})

export default router;