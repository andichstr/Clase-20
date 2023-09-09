export default class TicketDTO {
    constructor(ticket){
        this.code = ticket.code || null;
        this.purchase_datetime = ticket.purchase_datetime || new Date();
        this.ammount = ticket.ammount || 0;
        this.purchaser = ticket.purchaser || null;
        this.products = ticket.products || null;
    }
}
