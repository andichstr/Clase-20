import dotenv from 'dotenv';
dotenv.config();

export default {
    persistence: process.env.PERSISTENCE,
    connectionUrl: process.env.CONNECTION_URL
}