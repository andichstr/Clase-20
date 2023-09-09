import swaggerJSDoc from "swagger-jsdoc";
import { __dirname } from "../dirname.js";

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentación de nuestra API para usuarios y productos.",
            description: "Nuestra API devuelve informacion sobre usuarios y productos en formato JSON."
        }
    },
    apis:[`${__dirname}/docs/**/*.yaml`]
}
export const specs = swaggerJSDoc(swaggerOptions)