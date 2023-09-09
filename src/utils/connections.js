import { connect } from "mongoose";
import { logger } from "./logger.js";

const DB_URL = "mongodb+srv://andischus:bienrustico19@andres-cluster.t8midx9.mongodb.net/ecommerce";

export async function connectMongo() {
  try {
    await connect(DB_URL);
    logger.info("Connected to MongoDB");
  } catch (e) {
    logger.error(e);
    throw "Something went wrong connecting to MongoDB";
  }
}