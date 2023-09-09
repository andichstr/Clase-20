//@ts-check
import { Schema, model } from "mongoose";

const TICKET_COLLECTION = "tickets";

const schema = new Schema({
    code: { type: String, required: true },
    purchase_datetime: { type: Date, required: true },
    ammount: { type: Number, required: true },
    purchaser: { type: String, required: true },
    products: { type: Array, required: true }
});

export const TicketModel = model(TICKET_COLLECTION, schema);