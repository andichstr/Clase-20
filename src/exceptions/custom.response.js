//@ts-check
export default class CustomResponse {
    constructor(message, status, data="") {
        this.message = message
        this.status = status;
        this.data = data;
    }
}