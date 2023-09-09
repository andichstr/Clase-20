import config from "../config/config.js";
import mongoose from "mongoose";

export let CartsRepository, ProductsRepository, UsersRepository, MessagesRepository, TicketsRepository;
switch(config.persistence){
    case "MONGO":
        const connection = mongoose.connect(config.connectionUrl);
        const {default:UsersMongo} = await import("./mongo/users.mongo.js");
        const {default:ProductsMongo} = await import("./mongo/products.mongo.js");
        const {default:CartsMongo} = await import("./mongo/carts.mongo.js");
        const {default:MessagesMongo} = await import("./mongo/messages.mongo.js");
        const {default:TicketsMongo} = await import("./mongo/tickets.mongo.js");
        CartsRepository = CartsMongo;
        ProductsRepository = ProductsMongo;
        UsersRepository = UsersMongo;
        MessagesRepository = MessagesMongo;
        TicketsRepository = TicketsMongo;
        break;
    case "MEMORY":
        const {default:UsersMemory} = await import("./memory/users.memory.js");
        const {default:ProductsMemory} = await import("./memory/products.memory.js");
        const {default:CartsMemory} = await import("./memory/carts.memory.js");
        const {default:MessagesMemory} = await import("./memory/messages.memory.js");
        const {default:TicketsMemory} = await import("./mongo/tickets.memory.js");
        CartsRepository = CartsMemory;
        ProductsRepository = ProductsMemory;
        UsersRepository = UsersMemory;
        MessagesRepository = MessagesMemory;
        TicketsRepository = TicketsMemory;
        break;
}