import { MessagesModel } from "../../models/messages.model";

export default class Message {
    constructor(){
        this.messages = []
    }

    async get() {
        return this.messages
    }

    async create(message) {
        this.messages.push(message);
    }
}
