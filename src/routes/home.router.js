import { Router } from "express";
import { ProductService } from "../services/products.service.js";
import { logger } from "../utils/logger.js";

const router = Router();
const service = new ProductService();

router.get('/', async (req, res) => {
    try {
        let products = await service.getProducts();
        if (!!products){
            if (!!req.query.limit && req.query.limit >= 0 && products.length > req.query.limit) products = products.slice(0, req.query.limit);
            return res.status(200).render("home", { products });
        }else return res.status(404).json({
                status: "Error",
                message: "Products not found",
                data: null
        })
    } catch (e) {
        logger.error(e);
    };
})

export default router;